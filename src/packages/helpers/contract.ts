import { Contract, utils } from "ethers"
import tokenABI from "../abi/tokenABI.json"
import routerABI from "../abi/routerABI.json"
import { config } from "../config/constants"
import { providerSigner } from "./provider-signer"

class _Contract {
    tokenInterface: utils.Interface

    constructor() {
        this.tokenInterface = new utils.Interface(tokenABI)
    }

    getContract(contractAddress: string): Contract {
        return new Contract(contractAddress, tokenABI, providerSigner.wsProvider)
    }

    uniswapRouterContract(): Contract {
        return new Contract(config.UNISWAP_ROUTER_ADDRESS, routerABI, providerSigner.signer)
    }

    sushiRouterContract(): Contract {
        return new Contract(config.SUSHISWAP_ROUTER_ADDRESS, routerABI, providerSigner.signer)
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

    async contractSymbol(tokenAddress: string) {
        try {
            const contract = this.getContract(tokenAddress)

            return await contract.symbol()
        } catch (error) {
            console.log("Error getting contract symbol ", error)
        }
    }

}

export const contract = new _Contract()