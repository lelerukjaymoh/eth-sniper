import { providers, Wallet } from "ethers";
import { config } from "../config/constants";

const wsProvider = new providers.WebSocketProvider(config.WS_RPC!)

export const providerSigner = {
    wsProvider,
    signer: new Wallet(process.env.PRIVATE_KEY!).connect(wsProvider)
}  