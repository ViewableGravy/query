import { QueryKey } from "../core/queryCache"
import { isPlainObject } from "./isPlainObject"

/**
 * Default query & mutation keys hash function.
 * Hashes the value into a stable hash.
 */
export function hashKey(queryKey: QueryKey): string {
    return JSON.stringify(queryKey, (_, val) =>
        isPlainObject(val)
            ? Object.keys(val)
                .sort()
                .reduce((result, key) => {
                    result[key] = val[key]
                    return result
                }, {} as any)
            : val,
    )
}