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

testRugCheck("0xfD50aBbC285b556fbbdAB46C9Fe4A89F5435F589")
