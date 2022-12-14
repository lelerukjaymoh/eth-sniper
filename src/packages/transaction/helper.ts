import { BigNumber } from "ethers"
import { contract } from "../helpers/contract"

export const getAmountOutMin = (amountIn: BigNumber, path: string[]) => {
    try {
        const amountsOut = contract.routerContract().getAmountsOut(amountIn, path)
        const amountOut = amountsOut[path.length - 1]

        return amountOut

    } catch (error) {
        console.log("Error getting amountOutMin ", error)
    }
} 