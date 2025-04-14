import { QueryCache } from "./queryCache";
import { QueryKey, QueryOptions } from "./types";

// type fetchAction

type ResolvedAction<TQueryFnData> = {
    type: "resolved",
    data: TQueryFnData
}

type RejectedAction<TError> = {
    type: "rejected",
    error: TError
}

type InvokeAction<TQueryFnData, TError, TQueryKey extends QueryKey> = {
    /** Force invoke the queryFn. This should be called when we know that we want to fetch */
    type: "invoke",
    options: QueryOptions<TQueryFnData, TError, TQueryKey>
}

type Action<TQueryFnData, TError = unknown, TQueryKey extends QueryKey = QueryKey> =
    | ResolvedAction<TQueryFnData>
    | RejectedAction<TError>
    | InvokeAction<TQueryFnData, TError, TQueryKey>

type InternalOptions = {
    queryCache: QueryCache
}

class Status {
    #status: "fetching" | "error" | "loading" | "success" | "idle" = "idle"
    public isFetching: boolean = false
    public isLoading: boolean = false
    public isError: boolean = false
    public isSuccess: boolean = false

    constructor(status: "fetching" | "error" | "loading" | "success" | "idle") {
        this.status = status
    }

    protected set status(value: "fetching" | "error" | "loading" | "success" | "idle") {
        this.#status = value
        this.isLoading = value === "loading" || value === "fetching"
        this.isFetching = value === "fetching"
        this.isError = value === "error"
        this.isSuccess = value === "success"
    }

    public get status() {
        return this.#status
    }
}

export class Query<TQueryFnData, TError, TQueryKey extends QueryKey> extends Status {
    #queryCache: QueryCache
    #cacheExpiry: number | undefined = undefined;

    public queryKey: TQueryKey
    public queryFn: () => Promise<TQueryFnData>
    public staleTime: number
    public error: TError | undefined
    public data: TQueryFnData | undefined
    public promise: Promise<TQueryFnData> | null = null

    constructor(options: QueryOptions<TQueryFnData, TError, TQueryKey>, internalOptions: InternalOptions) {
        super("idle");

        this.queryKey = options.queryKey
        this.queryFn = options.queryFn
        this.staleTime = options.staleTime ?? 5 * 60 * 1000
        this.error = undefined
        this.data = undefined

        this.#queryCache = internalOptions.queryCache;
    }

    private dispatch = (action: Action<TQueryFnData, TError, TQueryKey>) => {
        switch (action.type) {
            case "resolved": {
                this.status = "success"
                this.data = action.data
                this.error = undefined
                break;
            }
            case "rejected": {
                this.status = "error"
                this.error = action.error
                this.data = undefined
                break;
            }
        }

        this.#queryCache.emit(this.queryKey);
    }

    private initiatePromise = (queryFn: () => Promise<TQueryFnData>) => {
        this.promise = queryFn();

        const onThen = (data: TQueryFnData) => this.dispatch({ type: "resolved", data });
        const onError = (error: TError) => this.dispatch({ type: "rejected", error });

        return this.promise.then(onThen).catch(onError);
    }

    public fetch = async (options: QueryOptions<TQueryFnData, TError, TQueryKey>) => {
        const hasCache = this.#cacheExpiry && this.#cacheExpiry > Date.now();
        const isStale = this.#cacheExpiry && this.#cacheExpiry < Date.now() + this.staleTime;
        
        if (!hasCache || isStale || this.isError) {
            // make the request if we are stale
            this.initiatePromise(options.queryFn ?? this.queryFn);
            await this.promise;
        }

        return this.data!;
    }

}