import { addresses } from "./address";

export const config = {
    WS_RPC: process.env.WS_RPC,

    // Telegram config
    BOT_TOKEN: process.env.BOT_TOKEN,
    TG_MESSAGE_RECEIVER: process.env.TG_MESSAGE_RECEIVER,

    EXCLUDED_INPUT_DATA: ["0x", "0x0"],

    // Main tokens that new tokens are paired to ie. WETH, USDT, USDC, BUSD
    BASE_TOKENS: [addresses.WETH, addresses.USDC, addresses.USDT, addresses.DAI],

    SUPPORTED_LIQUIDITY_METHODS: ["addLiquidityETH", "addLiquidity"],

    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY
}