import axios from "axios"
import { providers, utils } from "ethers"
import { waitForDebugger } from "inspector"
import { addresses } from "../config/address"
import { config } from "../config/constants"
import { contract } from "../helpers/contract"
import { providerSigner } from "../helpers/provider-signer"
import { transaction } from "../helpers/transaction"
import { _utils } from "../helpers/utils"
import { rugChecker } from "../scanner/rug-checker"
import { sendNotification } from "../telegram/bot"
import { message } from "../telegram/message"
import { transact } from "../transaction"
import { transactionHelper } from "../transaction"


class Processor {
    constructor() { }

    async processTxn(txnHash: string, wsProvider: providers.WebSocketProvider) {
        try {

            // On receiving a tx hash get the transaction data 
            const txnResponse = await transaction.getTxResponse(wsProvider, txnHash)

            // This is the contract the transaction is sent to, for the purpose of this bot
            // we assume that the contract being called is an exchange router 
            const routerAddress = txnResponse?.to?.toLowerCase()

            if (txnResponse && routerAddress) {

                // Extract the transaction input data from the transaction data
                const txInput = txnResponse?.data

                // Extract the value sent with the transaction.  
                // This is used to get the amount of eth that is added in an addliquidityeth transaction
                const value = txnResponse?.value

                // decode the transaction data
                // This allows us to access the data 
                if (txInput && !config.EXCLUDED_INPUT_DATA.includes(txInput)) {
                    const txnDescription = await transaction.decodeTxn(txInput)

                    if (txnDescription) {

                        // REVIEW: Only focus on addliquidityeth and addliquidity txn methods at the moment

                        if (config.SUPPORTED_LIQUIDITY_METHODS.includes(txnDescription.name)) {

                            console.log("\n\n\n==============================================================================")

                            // Extract relevant transaction information
                            const txn = await transaction.getTxnData(txnDescription, value, txnHash)

                            console.log(routerAddress, config.UNISWAP_ROUTER_ADDRESS, config.SUSHISWAP_ROUTER_ADDRESS)

                            if (txn) {
                                console.log(`\n[${txnHash.substring(0, 10)}] : An incoming add liquidity txn to ${routerAddress == config.UNISWAP_ROUTER_ADDRESS.toLowerCase() ?
                                    "UNISWAP ROUTER" : routerAddress == config.SUSHISWAP_ROUTER_ADDRESS.toLowerCase() ?
                                        "SHUSI ROUTER" : "NOT SUPPORTED ROUTER"}`, txnHash)

                                // Set the transaction path early since its needed for checking  
                                const path = [addresses.WETH, txn.token]

                                // First check if the transaction is a new listing
                                const newListing = await transactionHelper.isNewListing(routerAddress, utils.parseEther("0.0001"), path)

                                console.log(`\n[${txnHash.substring(0, 10)}] : Is this a new listing: `, newListing)

                                if (newListing) {

                                    const minimumLiquidity = txn.baseToken == addresses.WETH ? config.MINIMUMLIQUIDITY.eth : config.MINIMUMLIQUIDITY.stable

                                    // Criteria for a good token
                                    // 1. contract has been verified
                                    // 2. Add liquidity amount is more than 600 usd ~ 0.5 eth
                                    // 3. Can buy and sell the token

                                    // Check that the liquidity amount is greater than the threshold
                                    if (txn.baseTokenLiquidityAmount > minimumLiquidity) {

                                        // Check if token has been approved
                                        const verificationStatus = await rugChecker.checkContractVerification(txn.token)

                                        console.log(`[${txnHash.substring(0, 10)}] : Contract Verified : `, verificationStatus)

                                        if (verificationStatus) {

                                            // Wait for the add liquidity txn to be confirmed before tryinng to check the rug status of the token
                                            // This is because the rug checker functionality needs liquidity to have already been added to the pool
                                            await wsProvider.waitForTransaction(txnHash, 1, 30000)

                                            // Confirm that liquidity was successfully added to the pool
                                            const _newListing = await transactionHelper.isNewListing(routerAddress, utils.parseEther("0.0001"), path)

                                            console.log("2nd New listing check ", _newListing)

                                            let startTime = Date.now()

                                            while (_newListing) {
                                                console.log("\nLiquidity has not been added to the pool waiting in a while loop ...")

                                                const newListingCheck = await transactionHelper.isNewListing(routerAddress, utils.parseEther("0.0001"), path)

                                                if (!newListingCheck) {
                                                    break
                                                } else if (Date.now() - startTime >= 20000) {
                                                    console.log("\n Liquidity not add yet. Waited for 20 secs, will proceed and disregard the token")
                                                    break
                                                }

                                                await _utils.wait(3000)
                                            }

                                            console.log("\nNow checking rug ...")

                                            // Check if the token is a rug
                                            const rugStatus = await rugChecker.checkRugStatus(txn.token)

                                            console.log(`\nToken rug status (${txn.token}) `, rugStatus, rugStatus.data ? rugStatus.data : "")

                                            if (!rugStatus.rug) {

                                                // Buy amount is a percentage of the liquidity amount added
                                                const percentageOfLiquidity = txn.baseTokenLiquidityAmount * config.PERCENTAGE_LIQUIDITY_BUY

                                                const buyAmount = percentageOfLiquidity > config.MAX_BUY_AMOUNT ? config.MAX_BUY_AMOUNT : percentageOfLiquidity

                                                const amountIn = utils.parseEther(buyAmount.toString())
                                                const amountOutMin = await transactionHelper.getAmountOutMin(routerAddress, amountIn, path)
                                                const slippagedAmount = amountOutMin.mul(100 - config.SLIPPAGE_PERCENTAGE)

                                                const deadline = Math.floor(Date.now() / 1000) + 60 * 2;

                                                if (amountOutMin) {
                                                    const buyData = {
                                                        path,
                                                        amountIn,
                                                        amountOutMin: slippagedAmount,
                                                        to: await providerSigner.signer.getAddress(),
                                                        deadline
                                                    }

                                                    const txnDescription = await transact.buy(routerAddress, buyData)

                                                    const tokenName = await contract.contractName(txn.token)
                                                    const baseTokenName = await contract.contractName(txn.baseToken)

                                                    await sendNotification(message.successfulBuy(txn.token, tokenName, "HOLDER", txn.baseTokenLiquidityAmount, baseTokenName))
                                                }

                                            } else {
                                                const tokenName = await contract.contractName(txn.token)

                                                await sendNotification(message.rugToken(txn.token, tokenName))
                                            }

                                        } else {
                                            const contractName = await contract.contractName(txn.token)

                                            // await sendNotification(message.contractNotVerified(contractName, txn.token))
                                        }
                                    } else {
                                        const tokenName = await contract.contractName(txn.token)
                                        const baseTokenSymbol = await contract.contractSymbol(txn.baseToken)

                                        // await sendNotification(message.notEnoughLiquidity(txn.token, tokenName, txn.baseTokenLiquidityAmount, baseTokenSymbol, txnHash))
                                    }
                                }
                            }
                        }

                    }
                }
            }
        } catch (error) {
            console.log("Error processing a transaction ", error)
        }
    }
}

export const processor = new Processor()

