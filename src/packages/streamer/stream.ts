import { providers } from "ethers"
import { stringify } from "querystring"
import { config } from "../config/constants"
import { providerSigner } from "../helpers/provider-signer"
import { transaction } from "../helpers/transaction"
import { processor } from "../processor/process"

class Streamer {
    wsProvider: providers.WebSocketProvider

    constructor() {
        this.wsProvider = providerSigner.wsProvider
    }

    stream() {
        this.wsProvider.on("pending", async (txnHash: string) => {
            processor.processTxn(txnHash, this.wsProvider)
        })

        this.wsProvider.on("error", (tx) => {

            // TODO: Implement sending TG notification when there is a streaming error
            console.log("Error streaming transaction ", tx)
        })
    }
}

export const streamer = new Streamer()