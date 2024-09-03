import styled from "styled-components";
import {useCustomBookingQuery} from "../../hooks/useCustomBookingQuery.js";
import {getBookingsAfterDate, getStaysAfterDate} from "../../services/apiBookings.js";
import Spinner from "../../ui/Spinner.jsx";
import {Stats} from "./Stats";
import {useCustomQuery} from "../../hooks/useCustomQuery.js";
import {getCabins} from "../../services/apiCabins.js";
import SalesChart from "./SalesChart";
import DurationChart from "./DurationChart";
import TodayActivity from "../check-in-out/TodayActivity";

const StyledDashboardLayout = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-rows: auto 34rem auto;
  gap: 2.4rem;
`;

export default function DashboardLayout() {
    const {result: bookings, isLoading: isLoadingBookings} = useCustomBookingQuery('bookings', getBookingsAfterDate)
    const {confirmedStays, filterValue: numDays, isLoading: isLoadingStays} = useCustomBookingQuery('stays', getStaysAfterDate, true)
    const {result: cabins, isLoadingCabins } = useCustomQuery('cabins', getCabins);

    if (isLoadingBookings || isLoadingStays || isLoadingCabins) return <Spinner />;

    return (
        <StyledDashboardLayout>
            <Stats
                bookings={bookings}
                confirmedStays={confirmedStays}
                numDays={numDays}
                cabinCount={cabins.length} />
            <TodayActivity />
            <DurationChart confirmedStays={confirmedStays} />
            <SalesChart bookings={bookings} numDays={numDays}/>
        </StyledDashboardLayout>
    )
}