import { checker } from "./packages/helpers/checker"
import { streamer } from "./packages/streamer/stream"

// index.ts is the entry point for the application so we should check that all .env variables have been successfully loaded
// before continuing with execution
checker.initialCheck()

const main = () => {
    streamer.stream()
}

main()