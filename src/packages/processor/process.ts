import axios from "axios"
import { providers, utils } from "ethers"
import { addresses } from "../config/address"
import { config } from "../config/constants"
import { contract } from "../helpers/contract"
import { providerSigner } from "../helpers/provider-signer"
import { transaction } from "../helpers/transaction"
import { _utils } from "../helpers/utils"
import { rugChecker } from "../scanner/rug-checker"
import { sendNotification } from "../telegram/bot"
import { message } from "../telegram/message"
import { getAmountOutMin } from "../transaction/helper"
import { transact } from "../transaction/transact"

class Processor {
    constructor() { }

    async processTxn(txnHash: string, wsProvider: providers.WebSocketProvider) {
        try {
            // On receiving a tx hash get the transaction data 
            const txnResponse = await transaction.getTxResponse(wsProvider, txnHash)

            if (txnResponse) {

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
                            // Extract relevant transaction information
                            const txn = await transaction.getTxnData(txnDescription, value, txnHash)

                            if (txn) {
                                console.log("\n\nAn add liquidity txn ", txnHash, txn)

                                const minimumLiquidity = txn.baseToken == addresses.WETH ? config.MINIMUMLIQUIDITY.eth : config.MINIMUMLIQUIDITY.stable

                                // Criteria for a good token
                                // 1. contract has been verified
                                // 2. Add liquidity amount is more than 600 usd ~ 0.5 eth
                                // 3. Can buy and sell the token

                                // Check that the liquidity amount is greater than the threshold
                                if (txn.baseTokenLiquidityAmount > minimumLiquidity) {

                                    // Check if token has been approved
                                    const verificationStatus = await rugChecker.checkContractVerification(txn.token)

                                    console.log("Verification status ", verificationStatus)

                                    if (verificationStatus) {

                                        // Buy amount is a percentage of the liquidity amount added
                                        const percentageOfLiquidity = txn.baseTokenLiquidityAmount * config.PERCENTAGE_LIQUIDITY_BUY

                                        const buyAmount = percentageOfLiquidity > config.MAX_BUY_AMOUNT ? config.MAX_BUY_AMOUNT : percentageOfLiquidity
                                        const path = [addresses.WETH, txn.token]

                                        const amountIn = utils.parseEther(buyAmount.toString())
                                        let amountOutMin;

                                        let startTime = Date.now()

                                        // Check that liquidity has already been added to the pool
                                        while (true) {

                                            console.log("While loop ...")
                                            try {
                                                amountOutMin = await getAmountOutMin(amountIn, path)
                                                break
                                            } catch (error) {
                                                amountOutMin = await getAmountOutMin(amountIn, path)
                                            }

                                            await _utils.wait(2000)
                                        }

                                        console.log("\nTime taken on while loop (Checking liquidity )", Date.now() - startTime)

                                        // Check if the token is a rug
                                        const rugStatus = await rugChecker.checkRugStatus(txn.token)

                                        console.log("Token rug status ", rugStatus)

                                        if (!rugStatus.rug) {

                                            const slippagedAmount = amountOutMin.mul(100 - config.SLIPPAGE_PERCENTAGE)

                                            const deadline = Math.floor(Date.now() / 1000) + 60 * 2;

                                            if (slippagedAmount) {
                                                const buyData = {
                                                    path,
                                                    amountIn,
                                                    amountOutMin: slippagedAmount,
                                                    to: await providerSigner.signer.getAddress(),
                                                    deadline
                                                }

                                                const txnDescription = await transact.buy(buyData)

                                                const tokenName = await contract.contractName(txn.token)

                                                await sendNotification(message.successfulBuy(txn.token, tokenName, "HOLDER"))
                                            }

                                        } else {
                                            const tokenName = await contract.contractName(txn.token)

                                            await sendNotification(message.rugToken(txn.token, tokenName))
                                        }

                                    } else {
                                        let message = "Token contract code not verified"
                                        message += "\n\nToken Name"
                                        message += `${await contract.contractName(txn.token)}`
                                        message += "\n\nToken"
                                        message += `\nhttps://etherscan.io/address/${txn.token}#code`

                                        // sendNotification(message)
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
        } catch (error) {
            console.log("Error processing a transaction ", error)
        }
    }
}

export const processor = new Processor()

