import Stat from "./Stat.jsx";
import {HiOutlineBriefcase, HiOutlineChartBar, HiOutlineBanknotes, HiOutlineCalendarDays} from "react-icons/hi2";
import {formatCurrency} from "../../utils/helpers.js";

export function Stats({bookings, confirmedStays, numDays, cabinCount}) {
    const numberOfBookings = bookings.length;
    const sales = bookings.reduce((acc, cur) => acc + cur.totalPrice, 0);
    const checkins = confirmedStays.length;
    const occupation = confirmedStays.reduce((acc, cur) => acc + cur.numNights,0) / (numDays * cabinCount);
    return (
        <>
            <Stat title="Bookings" color="blue" value={numberOfBookings} icon={<HiOutlineBriefcase />} />
            <Stat title="Sales" color="green" value={formatCurrency(sales)} icon={<HiOutlineBanknotes />} />
            <Stat title="Check ins" color="indigo" value={checkins} icon={<HiOutlineCalendarDays />} />
            <Stat title="Occupancy rate" color="yellow" value={`${Math.round(occupation * 100)}%`} icon={<HiOutlineChartBar />} />
        </>
    )
}