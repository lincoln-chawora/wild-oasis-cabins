import Button from "../../ui/Button.jsx";
import {useCustomQueryClient} from "../../hooks/useCustomQueryClient.js";
import {createEditBooking} from "../../services/apiBookings.js";

function CheckoutButton({ bookingId }) {
    const {mutate: checkout, isLoading: isCheckingOut} = useCustomQueryClient('today-activity', ({id, obj}) => createEditBooking(id, obj), `Guest has checked out.`)

    function handleCheckout() {
        const obj = {status: 'checked-out'};
        checkout({id: bookingId, obj});
    }

    return (
        <Button variation="primary" size="small" onClick={handleCheckout} disabled={isCheckingOut}>
          Check out
        </Button>
    );
}

export default CheckoutButton;
