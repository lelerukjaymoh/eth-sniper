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

testRugCheck("0x208C3C8d93D38171fBE33D048a276637E9d7f2b9")
