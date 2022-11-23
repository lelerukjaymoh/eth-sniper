import { utils } from "ethers"
import tokenABI from "../abi/tokenABI.json"

class Contract {
    tokenInterface: utils.Interface

    constructor() {
        this.tokenInterface = new utils.Interface(tokenABI)
    }


}

export const contract = new Contract()