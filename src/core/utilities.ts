import { QueryKey, QueryOptions, TaggedQueryKey } from "./types";

export const createOptions = <
    TData = unknown,
    TError = unknown,
    const TQueryKey extends QueryKey = QueryKey
>(opts: QueryOptions<TData, TError, TQueryKey>): QueryOptions<
    TData,
    TError,
    TaggedQueryKey<NoInfer<TQueryKey>, TData, TError>
> => opts as any;