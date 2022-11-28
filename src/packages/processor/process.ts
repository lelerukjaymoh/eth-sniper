import { providers } from "ethers"
import { config } from "../config/constants"
import { contract } from "../helpers/contract"
import { transaction } from "../helpers/transaction"
import { sendNotification } from "../telegram/bot"
import { message } from "../telegram/message"

class Processor {
    constructor() { }

    async processTxn(txHash: string, wsProvider: providers.WebSocketProvider) {
        try {
            // On receiving a tx hash get the transaction data 
            const txnResponse = await transaction.getTxResponse(wsProvider, txHash)

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
                        console.log("Txn ", txnResponse)

                        // REVIEW: Only focus on addliquidityeth and addliquidity txn methods at the moment

                        if (config.SUPPORTED_LIQUIDITY_METHODS.includes(txnDescription.name)) {
                            // Extract relevant transaction information
                            const txn = await transaction.getTxnData(txnDescription, value, txHash)

                            if (txn) {
                                console.log("Data ", txHash, txn)

                                // REVIEW: implementation for sending the message when liquidity is added to be removed later 
                                //since it slows down the bot 

                                const tokenName = await contract.contractName(txn.token)
                                const baseTokenSymbol = await contract.contractSymbol(txn.baseToken)
                                const addLiquidityMessage = message.addLiquidityTxnMessage(tokenName, baseTokenSymbol, txn.token, txn.baseTokenLiquidityAmount, txHash)

                                await sendNotification(addLiquidityMessage)
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

