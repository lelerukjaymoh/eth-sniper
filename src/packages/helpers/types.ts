import { BigNumber } from "ethers";

export interface TxnData {
    name: string,
    value: BigNumber,
    token: string,
    baseToken: string,
    baseTokenLiquidityAmount: Number
}