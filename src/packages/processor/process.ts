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

            // Extract the transaction input data from the transaction data
            const txInput = txnResponse?.data


            // decode the transaction data
            // This allows us to access the data 
            if (txInput && !config.EXCLUDED_INPUT_DATA.includes(txInput)) {
                const txnDescription = await transaction.decodeTxn(txInput)

                if (txnDescription) {
                    console.log("Txn ", txHash)

                    // REVIEW: Only focus on addliquidityeth and addliquidity txn methods at the moment

                    if (config.SUPPORTED_LIQUIDITY_METHODS.includes(txnDescription.name)) {
                        // Extract relevant transaction information
                        const txn = await transaction.getTxnData(txnDescription)

                        if (txn) {
                            console.log("Txn ", txHash, txn)

                            // REVIEW: implementation for sending the message when liquidity is added to be removed later 
                            //since it slows down the bot 

                            const tokenName = await contract.contractName(txn.token)
                            const addLiquidityMessage = message.addLiquidityTxnMessage(tokenName, txn.token, txn.baseTokenLiquidityAmount)
                            await sendNotification(addLiquidityMessage)
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

