import {useQuery} from "@tanstack/react-query";
import {useSearchParams} from "react-router-dom";
import {subDays} from "date-fns";

export function useCustomBookingQuery(qKey, mFn, stays = false) {
    const [searchParams] = useSearchParams();

    const filterValue = !searchParams.get('last') ? 7 : Number(searchParams.get('last'));
    const filter = subDays(new Date(), filterValue).toISOString();

    const {
        isLoading,
        data: {data: result} = {},
        error
    } = useQuery({
        queryKey: [qKey, `last-${filterValue}`],
        queryFn: () => mFn(filter)
    });

    let confirmedStays;

    if (stays) {
        confirmedStays = result?.filter(stay => stay.status === 'checked-in' || stay.status === 'checked-out')
    }

    return {result, confirmedStays, filterValue, isLoading, error};
}