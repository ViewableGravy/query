import { hashKey } from "../utilities/hashKey";
import { CacheEntry, GetState } from "./types";

export class QueryCache {
    #cache = new Map<string, CacheEntry<unknown, unknown>>()

    constructor() { }

    public getQuery: GetState = (queryKey) => {
        return this.#cache.get(hashKey(queryKey)) as any;
    }

    public clear() {
        this.#cache.clear();
    }
}
