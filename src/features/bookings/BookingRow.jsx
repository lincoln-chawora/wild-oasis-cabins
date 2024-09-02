import styled from "styled-components";
import { format, isToday } from "date-fns";

import Tag from "../../ui/Tag.jsx";
import Table from "../../ui/Table.jsx";

import { formatCurrency } from "../../utils/helpers.js";
import { formatDistanceFromNow } from "../../utils/helpers.js";
import Menus from "../../ui/Menus.jsx";
import {HiEye, HiTrash} from "react-icons/hi";
import {useNavigate} from "react-router-dom";
import {HiArrowDownOnSquare, HiArrowUpOnSquare} from "react-icons/hi2";
import {useCustomQueryClient} from "../../hooks/useCustomQueryClient.js";
import {deleteBooking, updateBooking} from "../../services/apiBookings.js";
import Modal from "../../ui/Modal.jsx";
import ConfirmDelete from "../../ui/ConfirmDelete.jsx";

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Amount = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function BookingRow({
  booking: {
    id: bookingId,
    created_at,
    startDate,
    endDate,
    numNights,
    numGuests,
    totalPrice,
    status,
    guests: { fullName: guestName, email },
    cabins: { name: cabinName },
  },
}) {
    const navigate = useNavigate();

    const {mutate: checkout, isLoading: isCheckingOut} = useCustomQueryClient('bookings', ({id, obj}) => updateBooking(id, obj), `Guest has checked out.`)

    const {
        mutate: deleteBookingById,
        isLoading: isDeleting
    } = useCustomQueryClient('bookings', deleteBooking, `Booking #${bookingId} successfully deleted.`)


    function handleCheckout() {
        const obj = {status: 'checked-out'};
        checkout({id: bookingId, obj});
    }

    const statusToTagName = {
        unconfirmed: "blue",
        "checked-in": "green",
        "checked-out": "silver",
    };

  return (
      <Table.Row>
          <Cabin>{cabinName}</Cabin>

          <Stacked>
            <span>{guestName}</span>
            <span>{email}</span>
          </Stacked>

          <Stacked>
            <span>
              {isToday(new Date(startDate))
                ? "Today"
                : formatDistanceFromNow(startDate)}{" "}
              &rarr; {numNights} night stay
            </span>
            <span>
              {format(new Date(startDate), "MMM dd yyyy")} &mdash;{" "}
              {format(new Date(endDate), "MMM dd yyyy")}
            </span>
          </Stacked>

          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

          <Amount>{formatCurrency(totalPrice)}</Amount>

          <Modal>
              <Menus.Menu>
                <Menus.Toggle id={bookingId} />
                <Menus.List id={bookingId}>
                    <Menus.Button onClick={() => navigate(`/bookings/${bookingId}`)} icon={<HiEye />}>See Details</Menus.Button>
                    {status === 'unconfirmed' && (
                        <Menus.Button
                            icon={<HiArrowDownOnSquare />}
                            onClick={() => navigate(`/checkin/${bookingId}`)}
                        >Check in</Menus.Button>
                    )}

                    {status === 'checked-in' && (
                        <Menus.Button
                            icon={<HiArrowUpOnSquare />}
                            disabled={isCheckingOut}
                            onClick={handleCheckout}
                        >Check out</Menus.Button>
                    )}

                    <Modal.Open opens="delete-booking-confirmation">
                        <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                    </Modal.Open>
                </Menus.List>
              </Menus.Menu>
              <Modal.Content name="delete-booking-confirmation">
                  <ConfirmDelete resourceName={`booking #${bookingId}`} onConfirm={() => deleteBookingById(bookingId)} isDeleting={isDeleting} />
              </Modal.Content>
          </Modal>
      </Table.Row>
  );
}

export default BookingRow;
