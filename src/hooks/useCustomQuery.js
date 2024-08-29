import {useQuery} from "@tanstack/react-query";
import {useSearchParams} from "react-router-dom";

export function useCustomQuery(qKey, mFn, isFiltered = false) {
    const [searchParams] = useSearchParams();

    const filterValue = searchParams.get('status');

    const filter = !isFiltered || !filterValue || filterValue === 'all'
        ? null
        : { field: 'status', value: filterValue };

    const sortByRaw = searchParams.get('sortBy') || 'startDate-desc';
    const [field, direction] = sortByRaw.split('-');
    const sortBy = isFiltered ? {field, direction} : null;

    // This custom hooks queryFn needs a function that returns a promise.
    const {data, isLoading, error} = useQuery({
        queryKey: [qKey, filter, sortBy],
        queryFn: () => mFn({filter, sortBy})
    });

    return {data, isLoading, error};
}