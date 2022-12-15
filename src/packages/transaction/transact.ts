import { contract } from "../helpers/contract"
import { BuyData } from "../helpers/types"
import { sendNotification } from "../telegram/bot"
import { message } from "../telegram/message"

class Transact {
    constructor() { }

    async buy(buyData: BuyData) {
        try {

            console.log("Buy data  ", buyData)

            const txnResponse = await contract.routerContract().callStatic.swapExactETHForTokens(
                buyData.amountOutMin,
                buyData.path,
                buyData.to,
                buyData.deadline,
                {
                    value: buyData.amountIn
                }
            )

            console.log("\nTxn response ", txnResponse)

            return txnResponse

            // const txnDescription = await txnResponse.wait()

            // console.log("\n\nTxn ", txnDescription)

            // return txnDescription

        } catch (error: any) {
            error = JSON.parse(JSON.stringify(error)).error.reason

            console.log("\n\nError buying token ", buyData.path[buyData.path.length - 1], error)

            const token = buyData.path[buyData.path.length - 1]
            const tokenName = await contract.contractName(token)

            await sendNotification(message.failedBuy(token, tokenName, error))
        }
    }
}

export const transact = new Transact()