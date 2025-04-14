/* eslint-disable @typescript-eslint/no-unused-vars */
export const dataTagSymbol = Symbol('dataTagSymbol')
export type dataTagSymbol = typeof dataTagSymbol
export const dataTagErrorSymbol = Symbol('dataTagErrorSymbol')
export type dataTagErrorSymbol = typeof dataTagErrorSymbol

export type BasicQueryKey = Array<unknown>
export type DataTag<TData, TError> = {
    [dataTagSymbol]: TData,
    [dataTagErrorSymbol]: TError
}
export type TaggedQueryKey<
    TBasicQueryKey = BasicQueryKey,
    TData = any,
    TError = any,
> = TBasicQueryKey & DataTag<TData, TError>
export type QueryKey = BasicQueryKey | TaggedQueryKey

export type GetDataFromQueryKey<TTaggedQueryKey extends QueryKey> =
    TTaggedQueryKey extends TaggedQueryKey<unknown, infer TData, unknown>
    ? TData
    : unknown

export type GetErrorFromQueryKey<TTaggedQueryKey extends QueryKey> =
    TTaggedQueryKey extends TaggedQueryKey<unknown, unknown, infer TError>
    ? TError
    : unknown

export type CacheEntry<TData = unknown, TError = Error> = {
    data: TData | undefined,
    error: TError | undefined,
    isError: boolean,
    isFetching: boolean,
    isLoading: boolean,
    status: "pending" | "error" | "loading",
    staleTime: number
}

export type QueryOptions<TData, TError = Error, TQueryKey extends QueryKey = QueryKey> = {
    queryKey: TQueryKey,
    queryFn: () => Promise<TData>,
    staleTime?: number
}

export type GetState = <TQueryKey extends QueryKey = QueryKey>(queryKey: TQueryKey) =>
    | undefined
    | CacheEntry<
        GetDataFromQueryKey<TQueryKey>,
        GetErrorFromQueryKey<TQueryKey>
    >