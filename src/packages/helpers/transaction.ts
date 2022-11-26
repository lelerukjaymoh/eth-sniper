import { BigNumber, providers, utils } from "ethers"
import { config } from "../config/constants"
import { sendNotification } from "../telegram/bot"
import { message } from "../telegram/message"
import { contract } from "./contract"
import { TxnData } from "./types"

class Transaction {
    constructor() {
    }

    async getTxResponse(provider: providers.WebSocketProvider, txHash: string): Promise<providers.TransactionResponse | undefined> {
        try {
            return await provider.getTransaction(txHash)
        } catch (error: any) {
            console.log("Error fetching the transaction ", txHash, error)

            // Send a notification if getting the transaction response failed
            await sendNotification(message.failedGetTxnMessage(txHash, error))
        }
    }

    async decodeTxn(txInputData: string) {
        try {
            return await contract.tokenInterface.parseTransaction({ data: txInputData })
        } catch (error) {

            // This means that the ABI used does not support the method called in the transaction
            // Ignore all transaction that don't have supported methods 


            // console.log("Error decoding txn input data ", error)
        }
    }

    async getTxnData(txn: utils.TransactionDescription): Promise<TxnData | undefined> {
        try {

            let token: string;
            let baseTokenLiquidityAmount: BigNumber

            if (txn.name == "addLiquidityETH") {
                token = txn.args.token
                baseTokenLiquidityAmount = txn.args.amountETHMin
            } else {
                const liquidityPath: string[] = [txn.args.tokenA, txn.args.tokenB]
                const [_token, liquidityAmount] = this.getTxnTokenAndLiquidity(liquidityPath, txn.args.amountADesired, txn.args.amountBDesired)

                token = _token
                baseTokenLiquidityAmount = liquidityAmount
            }

            const decimals = await contract.contractDecimals(token)


            const txnData = {
                name: txn.name,
                value: txn.value,
                token,
                baseTokenLiquidityAmount: parseFloat(utils.formatUnits(baseTokenLiquidityAmount, decimals))
            }

            return txnData
        } catch (error) {
            console.log("Error getting txn data ", error)
        }


    }

    getTxnTokenAndLiquidity(path: string[], amountA: BigNumber, amountB: BigNumber): [string, BigNumber] {
        let token = path[0]
        let liquidityAmount = amountA

        if (config.BASE_TOKENS.includes(path[0])) {
            token = path[path.length - 1]
            liquidityAmount = amountB
        }

        return [token, liquidityAmount]
    }
}

export const transaction = new Transaction()