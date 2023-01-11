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

testRugCheck("0x9CE9A52caa1436CE5bCD0817a559Ff87668FA109")
