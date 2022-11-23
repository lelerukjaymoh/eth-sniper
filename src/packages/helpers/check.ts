class Checker {
    constructor() {
    }

    initialCheck() {
        if (
            !process.env.WS_RPC ||
            !process.env.BOT_TOKEN
        ) {
            throw new Error("One of the required environmental variables were not provided. \n WS_RPC \n BOT_TOKEN")
        }
    }
}

export const checker = new Checker()