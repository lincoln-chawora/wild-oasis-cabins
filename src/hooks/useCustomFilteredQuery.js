import {useQuery, useQueryClient} from "@tanstack/react-query";
import {useSearchParams} from "react-router-dom";
import {PAGE_SIZE} from "../utils/constants.js";

export function useCustomFilteredQuery(qKey, mFn) {
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();

    // FILTER.
    const filterValue = searchParams.get('status');
    const filter = !filterValue || filterValue === 'all'
        ? null
        : { field: 'status', value: filterValue };

    // SORT.
    const sortByRaw = searchParams.get('sortBy') || 'startDate-desc';
    const [field, direction] = sortByRaw.split('-');
    const sortBy = {field, direction};

    // PAGINATION.
    const page = !searchParams.get('page') ? 1 : Number(searchParams.get('page'));

    // This custom hooks queryFn needs a function that returns a promise.
    const {
        isLoading,
        data: {data: result, count} = {},
        error
    } = useQuery({
        queryKey: [qKey, filter, sortBy, page],
        queryFn: () => mFn({filter, sortBy, page})
    });

    const pageCount = Math.ceil(count / PAGE_SIZE);
    if (page < pageCount) {
        queryClient.prefetchQuery({
            queryKey: [qKey, filter, sortBy, page + 1],
            queryFn: () => mFn({filter, sortBy, page: page + 1})
        })
    }

    if (page > 1) {
        queryClient.prefetchQuery({
            queryKey: [qKey, filter, sortBy, page - 1],
            queryFn: () => mFn({filter, sortBy, page: page - 1})
        })
    }

    return {result, isLoading, error, count};
}