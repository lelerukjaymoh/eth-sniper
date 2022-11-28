class Checker {
    constructor() {
    }

    initialCheck() {
        if (
            !process.env.WS_RPC ||
            !process.env.BOT_TOKEN ||
            !process.env.TG_MESSAGE_RECEIVER
        ) {
            throw new Error("One of the required environmental variables were not provided. \n WS_RPC \n BOT_TOKEN \n TG_MESSAGE_RECEIVER ")
        }
    }
}

export const checker = new Checker()