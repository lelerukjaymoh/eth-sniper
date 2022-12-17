import { providerSigner } from "../packages/helpers/provider-signer"
import { processor } from "../packages/processor/process"

const testProcessingTransaction = (txnHash: string) => {
    try {
        processor.processTxn(txnHash, providerSigner.wsProvider)
    } catch (error) {
        console.log("Error testing txn processing ", error)
    }
}


testProcessingTransaction("0x35e6e3aa83bf30df8759ef07769ac02b1b606fb32c769cb452f2dc4975e55c15")