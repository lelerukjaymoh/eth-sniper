import axios from "axios"
import { config } from "../config/constants";

class RugChecker {
    constructor() { }

    // Check if a contract is a rug
    async checkRugStatus(tokenAddress: string) {
        try {

            console.log("Checking if a token is a Rug ", tokenAddress)

            const { data } = await axios({
                method: 'post',
                url: config.RUG_CHECKER_URL,
                data: {
                    tokenAddress: tokenAddress
                }
            });

            return data
        } catch (error) {
            console.log("Error checking the rug status of the contract ", error)
        }
    }

    // Check that the contract code has been  approved
    async checkContractVerification(tokenAddress: string) {
        try {

            const { data } = await axios({
                method: 'post',
                url: `https://api.etherscan.io/api?module=contract&action=getabi&address=${tokenAddress}&apikey=${config.ETHERSCAN_API_KEY} `,
            });

            console.log("\nCheck contract verification response  ", data.message, data.result.substring(1, 100))

            if (data) {
                if (data.result != "Contract source code not verified") {
                    return true
                }
            }

            return false

        } catch (error) {
            console.log("Error checking contract verification ", error)
        }
    }

}


export const rugChecker = new RugChecker()