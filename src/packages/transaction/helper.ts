import { BigNumber } from "ethers"
import { config } from "../config/constants"
import { contract } from "../helpers/contract"

class TransactionHelper {
    constructor() { }

    getAmountOutMin = async (routerAddress: string, amountIn: BigNumber, path: string[]) => {
        try {
            let amountsOut

            routerAddress == config.UNISWAP_ROUTER_ADDRESS.toLowerCase() ?
                amountsOut = await contract.uniswapRouterContract().getAmountsOut(amountIn, path) :
                amountsOut = await contract.sushiRouterContract().getAmountsOut(amountIn, path)

            const amountOut = amountsOut[path.length - 1]

            return amountOut

        } catch (error) {
            console.log("\nError getting amountOutMin ", error)
        }
    }

    async isNewListing(routerAddress: string, amountIn: BigNumber, path: string[]) {
        try {
            routerAddress == config.UNISWAP_ROUTER_ADDRESS.toLowerCase() ?
                await contract.uniswapRouterContract().getAmountsOut(amountIn, path) :
                await contract.sushiRouterContract().getAmountsOut(amountIn, path)

            return false
        } catch (error) {
            console.log("\nError checking new listing : ", error)
            return true
        }
    }

}

export const transactionHelper = new TransactionHelper()