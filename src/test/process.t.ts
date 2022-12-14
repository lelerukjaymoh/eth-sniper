import { providerSigner } from "../packages/helpers/provider-signer"
import { processor } from "../packages/processor/process"

const testProcessingTransaction = (txnHash: string) => {
    try {
        processor.processTxn(txnHash, providerSigner.wsProvider)
    } catch (error) {
        console.log("Error testing txn processing ", error)
    }
}


testProcessingTransaction("0xc81159b895df2aeaeb459878b5bd536223275f0cd95047765724431d5cb5136c")