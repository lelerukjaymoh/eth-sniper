import { rugChecker } from "../packages/scanner/rug-checker"

const checkContractVerification = async (tokenAddress: string) => {
    try {
        const data = await rugChecker.checkContractVerification(tokenAddress)

        if (data) {
            console.log("Contract is verified")
        } else {
            console.log("Contract is not verified ")
        }
    } catch (error) {
        console.log("Error checking contract verification status ", error)
    }
}


checkContractVerification("0xBB9bc244D798123fDe783fCc1C72d3Bb8C189413")
