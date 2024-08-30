import styled from "styled-components";
import BookingDataBox from "../bookings/BookingDataBox.jsx";

import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import ButtonGroup from "../../ui/ButtonGroup.jsx";
import Button from "../../ui/Button.jsx";
import ButtonText from "../../ui/ButtonText.jsx";

import { useMoveBack } from "../../hooks/useMoveBack.js";
import {useCustomQuery} from "../../hooks/useCustomQuery.js";
import {getBooking, updateBooking} from "../../services/apiBookings.js";
import Spinner from "../../ui/Spinner.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import Checkbox from "../../ui/Checkbox.jsx";
import {formatCurrency} from "../../utils/helpers.js";
import {useCustomQueryClient} from "../../hooks/useCustomQueryClient.js";

const Box = styled.div`
  /* Box */
  background-color: var(--color-grey-0);
  border: 1px solid var(--color-grey-100);
  border-radius: var(--border-radius-md);
  padding: 2.4rem 4rem;
`;

function CheckinBooking() {
    const navigate = useNavigate();
    const [confirmPaid, setConfirmPaid] = useState(false);
    const {bookingId: bookingID} = useParams();
    const {result: booking, isLoading } = useCustomQuery('booking', getBooking, {id: bookingID});
    const {mutate: checkin, isLoading: isCheckingIn} = useCustomQueryClient('booking', ({id, obj}) => updateBooking(id, obj), `${booking?.guests?.fullName} has been checked in.`)

    useEffect(() => {
        setConfirmPaid(booking?.isPaid ?? false);
    }, [booking]);

    const moveBack = useMoveBack();

    if (isLoading) return <Spinner />;

    const {
        id: bookingId,
        guests,
        totalPrice,
        numGuests,
        hasBreakfast,
        numNights,
        isPaid
    } = booking;

  function handleCheckin() {
      if (!confirmPaid) return;

      const obj = { status: 'checked-in', isPaid: true};

      checkin({id: bookingId, obj}, {
          onSuccess: () => {
              navigate("/");
          },
      });
  }

  return (
    <>
      <Row type="horizontal">
        <Heading as="h1">Check in booking #{bookingId}</Heading>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

        <Box>
            <Checkbox
                id="confirm"
                checked={confirmPaid}
                disabled={confirmPaid || isCheckingIn}
                onChange={() => setConfirmPaid((confirm) => !confirm)}
            >I confirm that {guests.fullName} has paid the total amount of {formatCurrency(totalPrice)}</Checkbox>
        </Box>

      <ButtonGroup>
        <Button onClick={handleCheckin} disabled={!confirmPaid || isCheckingIn}>Check in booking #{bookingId}</Button>
        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default CheckinBooking;
