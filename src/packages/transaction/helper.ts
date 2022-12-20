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
            await contract.routerContract().getAmountsOut(amountIn, path)

            return false
        } catch (error) {
            console.log("Error checking new listing : ", error)
            return true
        }
    }

}

export const transactionHelper = new TransactionHelper()