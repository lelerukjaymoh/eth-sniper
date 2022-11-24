import { providers } from "ethers"
import { sendNotification } from "../telegram/bot"
import { message } from "../telegram/message"
import { contract } from "./contract"

class Transaction {
    constructor() {
    }

    async getTxData(provider: providers.WebSocketProvider, txHash: string): Promise<providers.TransactionResponse | undefined> {
        try {
            return await provider.getTransaction(txHash)
        } catch (error: any) {
            console.log("Error fetching the transaction ", txHash, error)

            // Send a notification if getting the transaction response failed
            await sendNotification(message.failedGetTxn(txHash, error))
        }
    }

    async decodeTxn(txInputData: string) {
        try {
            return await contract.tokenInterface.parseTransaction({ data: txInputData })
        } catch (error) {

            // This means that the ABI used does not support the method called in the transaction
            // Ignore all transaction that don't have supported methods 


            // console.log("Error decoding txn input data ", error)
        }
    }
}

export const transaction = new Transaction()