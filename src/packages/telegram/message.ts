import { contract } from "../helpers/contract"

class Message {
  constructor() { }

  failedGetTxnMessage(txHash: string, error: string) {
    let message = "Error decoding txn "
    message += "\n\n Tx : "
    message += `\nhttps://etherscan.io/tx/${txHash}`
    message += "\n\n Error"
    message += `\n${error}`

    return message
  }

  async addLiquidityTxnMessage(tokenName: string, tokenAddress: string, liquidity: Number) {
    let message = "Add liquidity Notification"
    message += `\n\n${tokenName}`
    message += "\n\nToken address"
    message += `\n${tokenAddress}`
    message += "\n\nLiquidity Amount"
    message += `\n${liquidity}`

    return message
  }
}

export const message = new Message()