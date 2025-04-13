import { hashKey } from "../utilities/hashKey"

export const dataTagSymbol = Symbol('dataTagSymbol')
export type dataTagSymbol = typeof dataTagSymbol
export const dataTagErrorSymbol = Symbol('dataTagErrorSymbol')
export type dataTagErrorSymbol = typeof dataTagErrorSymbol

type BasicQueryKey = Array<unknown>
type DataTag<TData, TError> = {
    [dataTagSymbol]: TData,
    [dataTagErrorSymbol]: TError
}
type TaggedQueryKey<
    TBasicQueryKey = BasicQueryKey,
    TData = any,
    TError = any,
> = TBasicQueryKey & DataTag<TData, TError>
export type QueryKey = BasicQueryKey | TaggedQueryKey

type GetDataFromQueryKey<TTaggedQueryKey extends QueryKey> =
    TTaggedQueryKey extends TaggedQueryKey<unknown, infer TData, unknown>
        ? TData
        : unknown

type GetErrorFromQueryKey<TTaggedQueryKey extends QueryKey> =
    TTaggedQueryKey extends TaggedQueryKey<unknown, unknown, infer TError>
        ? TError
        : unknown

type CacheEntry<TData = unknown, TError = Error> = {
    data: TData | undefined,
    error: TError | undefined,
    isError: boolean,
    isFetching: boolean,
    isLoading: boolean,
    status: "pending" | "error" | "loading",
    staleTime: number
}

type QueryOptions<TData, TError = Error, TQueryKey extends QueryKey = QueryKey> = {
    queryKey: TQueryKey,
    queryFn: () => Promise<TData>,
}


const createOptions = <
    TData = unknown,
    TError = unknown,
    const TQueryKey extends QueryKey = QueryKey
>(opts: QueryOptions<TData, TError, TQueryKey>): QueryOptions<
    TData,
    TError,
    TaggedQueryKey<NoInfer<TQueryKey>, TData, TError>
> => opts as any;

type GetState = <TQueryKey extends QueryKey = QueryKey>(queryKey: TQueryKey) =>
    | undefined
    | CacheEntry<
        GetDataFromQueryKey<TQueryKey>,
        GetErrorFromQueryKey<TQueryKey>
    >


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

const cache = new QueryCache();

const createQueryOptions = () => {
    return createOptions({
        queryKey: ["test"],
        queryFn: async () => ({
            status: "success" as const
        })
    })
}

const result = cache.getQuery(createQueryOptions().queryKey)



result?.data?.status
