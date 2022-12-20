import axios from "axios"
import { config } from "../packages/config/constants";
import { rugChecker } from "../packages/scanner/rug-checker";

const testRugCheck = async (tokenAddress: string) => {
    try {
        console.log("Testing rug check ")
        const data = await rugChecker.checkRugStatus(tokenAddress)

        console.log("Token rug status ", data)
    } catch (error) {
        console.log("Error testing rug check ", error)
    }
}

testRugCheck("0xE51dD356f8007C8123Ea9cbaB1a074B9F38Fd6f2")
