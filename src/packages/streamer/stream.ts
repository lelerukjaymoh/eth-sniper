import { providers } from "ethers"
import { stringify } from "querystring"
import { config } from "../config/constants"
import { transaction } from "../helpers/transaction"
import { processor } from "../processor/process"

class Streamer {
    wsProvider: providers.WebSocketProvider

    constructor() {
        this.wsProvider = new providers.WebSocketProvider(config.WS_RPC!)
    }

    stream() {
        this.wsProvider.on("pending", async (txHash: string) => {
            processor.processTxn(txHash, this.wsProvider)
        })

        this.wsProvider.on("error", (tx) => {

            // TODO: Implement sending TG notification when there is a streaming error
            console.log("Error streaming transaction ", tx)
        })
    }
}

export const streamer = new Streamer()