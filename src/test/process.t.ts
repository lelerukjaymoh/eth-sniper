import { connector } from "../packages/helpers/connector"
import { processor } from "../packages/processor/process"

const testProcessingTransaction = (txnHash: string) => {
    try {
        processor.processTxn(txnHash, connector.WS_PROVIDER)
    } catch (error) {
        console.log("Error testing txn processing ", error)
    }
}


testProcessingTransaction("0xc81159b895df2aeaeb459878b5bd536223275f0cd95047765724431d5cb5136c")