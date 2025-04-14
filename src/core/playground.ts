import { QueryCache } from "./queryCache";
import { createOptions } from "./utilities";

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



// eslint-disable-next-line @typescript-eslint/no-unused-expressions
result?.data?.status