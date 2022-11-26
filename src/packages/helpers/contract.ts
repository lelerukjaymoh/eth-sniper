import { Contract, utils } from "ethers"
import tokenABI from "../abi/tokenABI.json"
import { connector } from "./connector"

class _Contract {
    tokenInterface: utils.Interface

    constructor() {
        this.tokenInterface = new utils.Interface(tokenABI)
    }

    getContract(contractAddress: string): Contract {
        return new Contract(contractAddress, tokenABI, connector.WS_PROVIDER)
    }

    async contractName(tokenAddress: string) {
        try {
            const contract = this.getContract(tokenAddress)

            return await contract.name()
        } catch (error) {
            console.log("Error getting contract name ", error)
        }
    }

    async contractDecimals(tokenAddress: string) {
        try {
            const contract = this.getContract(tokenAddress)

            return await contract.decimals()
        } catch (error) {
            console.log("Error getting contract decimals ", error)
        }
    }

}

export const contract = new _Contract()