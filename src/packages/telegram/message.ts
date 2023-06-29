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
    message += `\n${liquidity.toFixed(2)} ${baseTokenSymbol}`
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

  failedBuy(tokenAddress: string, tokenName: string, errorMessage: string) {
    let message = "Buy Txn Failed"
    message += `\n\n${tokenName}`
    message += "\n\nToken address"
    message += `\nhttps://etherscan.io/address/${tokenAddress}`
    message += "\n\nError"
    message += `\n${errorMessage}`

    return message
  }

  successfulBuy(tokenAddress: string, tokenName: string, txHash: string, liquidityAmount: number, baseTokenName: string) {
    let message = "Successful BUY Txn"
    message += `\n\n${tokenName}`
    message += "\n\nToken address"
    message += `\nhttps://etherscan.io/address/${tokenAddress}`
    message += "\n\nLiquidity Added"
    message += `\n${liquidityAmount} ${baseTokenName}`
    message += "\n\nTxn Hash"
    message += `\nhttps://etherscan.io/tx/${txHash}`

    return message
  }

  rugToken(tokenAddress: string, tokenName: string) {

    let message = "Token is Rug"
    message += `\n\nToken`
    message += `\n${tokenName}`
    message += `\n\nhttps://honeypot.is/ethereum?address=${tokenAddress}`

    return message
  }

  contractNotVerified(contractName: string, tokenAddress: string) {
    let message = "Token contract code not verified"
    message += "\n\nToken Name"
    message += `${contractName}`
    message += "\n\nToken"
    message += `\nhttps://etherscan.io/address/${tokenAddress}#code`

    return message
  }
}

export const message = new Message()