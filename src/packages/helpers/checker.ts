class Checker {
    constructor() {
    }

    initialCheck() {
        if (
            !process.env.WS_RPC ||
            !process.env.BOT_TOKEN ||
            !process.env.TG_MESSAGE_RECEIVER ||
            !process.env.PRIVATE_KEY
        ) {
            throw new Error("One of the required environmental variables were not provided. \n WS_RPC \n BOT_TOKEN \n TG_MESSAGE_RECEIVER \n PRIVATE_KEY")
        }
    }
}

export const checker = new Checker()