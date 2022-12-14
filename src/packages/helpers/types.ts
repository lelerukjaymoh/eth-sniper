import { BigNumber } from "ethers";

export interface TxnData {
    name: string,
    value: BigNumber,
    token: string,
    baseToken: string,
    baseTokenLiquidityAmount: number
}

export interface BuyData {
    path: string[],
    to: string,
    amountIn: BigNumber,
    amountOutMin: BigNumber,
    deadline: number
}