import { providerSigner } from "../packages/helpers/provider-signer"
import { processor } from "../packages/processor/process"

const testProcessingTransaction = (txnHash: string) => {
    try {
        console.log("Testing txn processing ...")
        processor.processTxn(txnHash, providerSigner.wsProvider)
    } catch (error) {
        console.log("Error testing txn processing ", error)
    }
}


testProcessingTransaction("0xfc0aa034e43b4cc45916f1c76a35577a51db73fa3ac13cc2b0a609b4ee630f02")