import { BigNumber } from "ethers"
import { contract } from "../helpers/contract"

class TransactionHelper {
    constructor() { }

    getAmountOutMin = async (amountIn: BigNumber, path: string[]) => {
        try {
            const amountsOut = await contract.routerContract().getAmountsOut(amountIn, path)
            const amountOut = amountsOut[path.length - 1]

            return amountOut

        } catch (error) {
            console.log("Error getting amountOutMin ", error)
        }
    }

    async isNewListing(amountIn: BigNumber, path: string[]) {
        try {
            const amountOut = await contract.routerContract().getAmountsOut(amountIn, path)
            console.log("Amount out ", amountOut)

            return true
        } catch (error) {
            return false
        }
    }

}

export const transactionHelper = new TransactionHelper()