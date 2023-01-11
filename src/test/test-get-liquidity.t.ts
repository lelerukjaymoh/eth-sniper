import { BigNumber } from "ethers"
import { TransactionDescription } from "ethers/lib/utils"
import { transaction } from "../packages/helpers/transaction"

const testGetLiquidityAmount = async (txn: TransactionDescription, value: BigNumber, txnHash: string) => {
    try {
        const data = await transaction.getTxnData(txn, value, txnHash)


        console.log("Data ", data)
    } catch (error) {
        console.log("Error getting pair liquidity ", error)
    }
}

// testGetLiquidityAmount()