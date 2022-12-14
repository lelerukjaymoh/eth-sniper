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

    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,

    MINIMUMLIQUIDITY: {
        eth: 0.5,
        stable: 600
    },

    RUG_CHECKER_URL: "http://168.119.213.58:8000/check",

    PERCENTAGE_LIQUIDITY_BUY: 10,

    MAX_BUY_AMOUNT: 0.002,
    SLIPPAGE_PERCENTAGE: 1,
    UNISWAP_ROUTER_ADDRESS: ""
}