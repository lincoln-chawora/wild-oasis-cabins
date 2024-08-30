import {useQuery} from "@tanstack/react-query";

export function useCustomQuery(qKey, mFn, params = {}) {
    // This custom hooks queryFn needs a function that returns a promise.
    const {
        isLoading,
        data: {data: result, count} = {},
        error
    } = useQuery({
        queryKey: [qKey, params.id],
        queryFn: () => mFn(params.id)
    });

    return {result, isLoading, error, count};
}