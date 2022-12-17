import axios from "axios"
import { config } from "../packages/config/constants";

const testRugCheck = async (tokenAddress: string) => {
    try {
        const { data } = await axios({
            method: 'post',
            url: config.RUG_CHECKER_URL,
            data: {
                tokenAddress: tokenAddress
            }
        });

        console.log("Token rug status ", data)
    } catch (error) {
        console.log("Error testing rug check ", error)
    }
}

testRugCheck("0xdAC17F958D2ee523a2206206994597C13D831ec7")
