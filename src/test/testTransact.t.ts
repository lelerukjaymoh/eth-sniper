import { utils } from "ethers"
import { addresses } from "../packages/config/address"
import { providerSigner } from "../packages/helpers/provider-signer"
import { BuyData } from "../packages/helpers/types"
import { getAmountOutMin } from "../packages/transaction/helper"
import { transact } from "../packages/transaction/transact"

const testBuying = async () => {
    try {

        const buyData: BuyData = {
            path: [addresses.WETH, "0xdac17f958d2ee523a2206206994597c13d831ec7"],
            to: await providerSigner.signer.getAddress(),
            amountIn: utils.parseEther("0.00001"),
            amountOutMin: await getAmountOutMin(utils.parseEther("0.0001"), [addresses.WETH, "0xdac17f958d2ee523a2206206994597c13d831ec7"]),
            deadline: Math.floor(Date.now() / 1000) + 60 * 2,
        }

        transact.buy(buyData)
    } catch (error) {
        console.log("Error testing txn processing ", error)
    }
}

testBuying()