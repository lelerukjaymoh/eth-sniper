class Message {
  constructor() { }

  failedGetTxn(txHash: string, error: string) {
    let message = "Error decoding txn "
    message += "\n\n Tx : "
    message += `\nhttps://etherscan.io/tx/${txHash}`
    message += "\n\n Error"
    message += `\n${error}`

    return message
  }
}

export const message = new Message()