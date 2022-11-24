import { providers } from "ethers"
import { config } from "../config/constants"
import { transaction } from "../helpers/transaction"

class Processor {
    constructor() { }

    async processTxn(txHash: string, wsProvider: providers.WebSocketProvider) {
        try {
            // On receiving a tx hash get the transaction data 
            const txnResponse = await transaction.getTxData(wsProvider, txHash)

            // Extract the transaction input data from the transaction data
            const txInput = txnResponse?.data


            // decode the transaction data
            // This allows us to access the data 
            if (txInput && !config.EXCLUDED_INPUT_DATA.includes(txInput)) {
                const txn = await transaction.decodeTxn(txInput)

                console.log("Txn ", txHash, txn)
            }
        } catch (error) {
            console.log("Error processing a transaction ", error)
        }
    }
}

export const processor = new Processor()