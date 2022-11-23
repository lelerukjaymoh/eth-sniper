import { providers } from "ethers"
import { transaction } from "../helpers/transaction"

class Streamer {
    wsProvider: providers.WebSocketProvider

    constructor() {
        this.wsProvider = new providers.WebSocketProvider(process.env.WS_RPC!)
    }

    stream() {
        this.wsProvider.on("pending", async (txHash: string) => {

            // On receiving a tx hash get the transaction data 
            const txnResponse = await transaction.getTxData(this.wsProvider, txHash)

            console.log("Txn ", txnResponse)
        })
    }
}

export const streamer = new Streamer()