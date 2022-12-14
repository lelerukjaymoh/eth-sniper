import { contract } from "../helpers/contract"
import { BuyData } from "../helpers/types"

class Transact {
    constructor() { }

    async buy(buyData: BuyData) {
        try {
            const txnResponse = await contract.routerContract().swapExactETHForTokens(
                buyData.amountOutMin,
                buyData.path,
                buyData.to,
                buyData.deadline
            )

            console.log("Txn response ", txnResponse)

            const txnDescription = await txnResponse.wait()

            console.log("Txn ", txnDescription)

        } catch (error) {
            console.log("Error buying token ", buyData.path[buyData.path.length - 1])
        }
    }
}

export const transact = new Transact()