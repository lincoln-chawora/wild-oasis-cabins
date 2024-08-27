import {useQuery} from "@tanstack/react-query";

export function useCustomQuery(qKey = 'cabins', mFn) {

    // This custom hooks queryFn needs a function that returns a promise.
    const {data, isLoading, error} = useQuery({
        queryKey: [qKey],
        queryFn: mFn
    });

    return {data, isLoading, error};
}