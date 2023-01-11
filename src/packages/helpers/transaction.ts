import { BigNumber, providers, utils } from "ethers"
import { addresses } from "../config/address"
import { config } from "../config/constants"
import { sendNotification } from "../telegram/bot"
import { message } from "../telegram/message"
import { contract } from "./contract"
import { TxnData } from "./types"

class Transaction {
    constructor() {
    }

    async getTxResponse(provider: providers.WebSocketProvider, txnHash: string): Promise<providers.TransactionResponse | undefined> {
        try {
            return await provider.getTransaction(txnHash)
        } catch (error: any) {
            console.log("Error fetching the transaction ", txnHash, error)

            // Send a notification if getting the transaction response failed
            // await sendNotification(message.failedGetTxnMessage(txnHash, error))
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

    async getTxnData(txn: utils.TransactionDescription, txnValue: BigNumber, txnHash: string): Promise<TxnData | undefined> {
        try {

            let token: string;
            let baseToken: string = addresses.WETH
            let baseTokenLiquidityAmount: BigNumber
            let value = txnValue

            if (txn.name == "addLiquidityETH") {
                token = txn.args.token
                baseToken = addresses.WETH
                baseTokenLiquidityAmount = txnValue
            } else {
                const liquidityPath: string[] = [txn.args.tokenA.toLowerCase(), txn.args.tokenB.toLowerCase()]

                const [_token, _baseToken, liquidityAmount] = this.getTxnTokenAndLiquidity(liquidityPath, txn.args.amountADesired, txn.args.amountBDesired)

                token = _token
                baseTokenLiquidityAmount = liquidityAmount

                baseToken = _baseToken
            }

            if (token && baseToken && baseTokenLiquidityAmount) {
                const decimals = await contract.contractDecimals(baseToken)

                const txnData = {
                    name: txn.name,
                    value,
                    token,
                    baseToken,
                    baseTokenLiquidityAmount: parseFloat(utils.formatUnits(baseTokenLiquidityAmount, decimals))
                }

                return txnData
            } else {

                const tokenName = await contract.contractName(token)
                const baseTokenName = await contract.contractName(baseToken)

                let error = "Error getting the token, baseToken and liquidity amount "
                error += `\n\n ${tokenName} (${baseTokenName})`

                // Fetching token  symbols takes long and my be removed in the future
                // At the moment its been used since the opportunity is already ending in an error, so no processes are slowed
                error += `\n\nTransaction : https://etherscan.io/tx/${txnHash}`

                console.log(error)

                await sendNotification(error)
            }

        } catch (error) {
            console.log("Error getting txn data ", error)
        }


    }

    getTxnTokenAndLiquidity(path: string[], amountA: BigNumber, amountB: BigNumber): [string, string, BigNumber] {
        let token: string | undefined
        let baseToken: string | undefined
        let liquidityAmount: BigNumber | undefined

        if (config.BASE_TOKENS.includes(path[0])) {
            token = path[path.length - 1]
            baseToken = path[0]
            liquidityAmount = amountA
        } else if (config.BASE_TOKENS.includes(path[path.length - 1])) {
            token = path[0]
            baseToken = path[path.length - 1]
            liquidityAmount = amountB
        }

        return [token!, baseToken!, liquidityAmount!]
    }
}

export const transaction = new Transaction()