import { QueryCache } from "./queryCache";


export class QueryClient {
    #cache: QueryCache;

    constructor() {
        // ... existing code ...

        this.#cache = new QueryCache();
    }

    public clear() {
        this.#cache.clear()
    }
}