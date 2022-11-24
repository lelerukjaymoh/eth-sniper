import { providers } from "ethers"
import { config } from "../packages/config/constants"

const testStreaming = () => {
    const provider = new providers.WebSocketProvider(config.WS_RPC!)

    provider.on("Pending", (txHash) => {
        console.log("TX ", txHash, new Date())
    })
}

testStreaming()