import { providers } from "ethers"
import { config } from "../packages/config/constants"

const testStreaming = () => {
    const provider = new providers.WebSocketProvider(config.WS_RPC!)

    const data = provider.getCode("0x3ce96d0443a6437798794820dfc449d95b48ee8b")

    console.log("Data ",)

    // provider.on("Pending", (txnHash) => {
    //     console.log("TX ", txnHash, new Date())
    // })
}

testStreaming()