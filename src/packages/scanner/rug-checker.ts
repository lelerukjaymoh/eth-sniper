import axios from "axios"

class RugChecker {
    constructor() { }

    // Check if a contract is a rug
    async checkRugStatus() {
        try {
            // const rugStatus = 
        } catch (error) {
            console.log("Error checking the rug status of the contract ", error)
        }
    }

    // Check that the contract code has been  approved
    async checkContractVerification() {
        try {
            const { data } = await axios.get(``)

            if (data && data.source.length < 1) {
                return false
            }

        } catch (error) {
            console.log("Error checking contract verification ", error)
        }
    }



}