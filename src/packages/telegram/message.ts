import { contract } from "../helpers/contract"

class Message {
  constructor() { }

  failedGetTxnMessage(txnHash: string, error: string) {
    let message = "Error decoding txn "
    message += "\n\n Tx : "
    message += `\nhttps://etherscan.io/tx/${txnHash}`
    message += "\n\n Error"
    message += `\n${error}`

    return message
  }

  addLiquidityTxnMessage(tokenName: string, baseTokenSymbol: string, tokenAddress: string, liquidity: Number, addLiquidityTxnHash: string) {
    let message = "Add liquidity Notification"
    message += `\n\n${tokenName} (${baseTokenSymbol})`
    message += "\n\nToken address"
    message += `\nhttps://etherscan.io/address/${tokenAddress}`
    message += "\n\nLiquidity Amount"
    message += `\n${liquidity} ${baseTokenSymbol}`
    message += "\n\nAdd liquidity Txn"
    message += `\nhttps://etherscan.io/tx/${addLiquidityTxnHash}`

    return message
  }

  notEnoughLiquidity(tokenAddress: string, tokenName: string, liquidity: Number, baseTokenSymbol: string, addLiquidityTxnHash: string) {
    let message = "Not enough liquidity"
    message += `\n\n${tokenName} (${baseTokenSymbol})`
    message += "\n\nToken address"
    message += `\nhttps://etherscan.io/address/${tokenAddress}`
    message += "\n\nLiquidity Amount"
    message += `\n${liquidity} ${baseTokenSymbol}`
    message += "\n\nAdd liquidity Txn"
    message += `\nhttps://etherscan.io/tx/${addLiquidityTxnHash}`

    return message
  }
}

export const message = new Message()