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


testProcessingTransaction("0xe783520022038c93c3b5503041f133998e290e588de5f3893298b59f3068ae90")