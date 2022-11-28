import { providers, Wallet } from "ethers";
import { config } from "../config/constants";

const WS_PROVIDER = new providers.WebSocketProvider(config.WS_RPC!)

export const connector = {
    WS_PROVIDER,
}  