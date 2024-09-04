import styled from "styled-components";

import BookingDataBox from "./BookingDataBox.jsx";
import Row from "../../ui/Row";
import Heading from "../../ui/Heading";
import Tag from "../../ui/Tag.jsx";
import ButtonGroup from "../../ui/ButtonGroup.jsx";
import Button from "../../ui/Button.jsx";
import ButtonText from "../../ui/ButtonText.jsx";

import { useMoveBack } from "../../hooks/useMoveBack.js";
import {useCustomQuery} from "../../hooks/useCustomQuery.js";
import {deleteBooking, getBooking, updateBooking} from "../../services/apiBookings.js";
import Spinner from "../../ui/Spinner.jsx";
import {useNavigate, useParams} from "react-router-dom";
import {HiArrowUpOnSquare} from "react-icons/hi2";
import {useCustomQueryClient} from "../../hooks/useCustomQueryClient.js";
import {HiTrash} from "react-icons/hi";
import Modal from "../../ui/Modal.jsx";
import ConfirmDelete from "../../ui/ConfirmDelete.jsx";
import Empty from "../../ui/Empty.jsx";

const HeadingGroup = styled.div`
  display: flex;
  gap: 2.4rem;
  align-items: center;
`;

function BookingDetail() {
    const navigate = useNavigate();
    const moveBack = useMoveBack();
    const {bookingId} = useParams();
    const {result: booking, isLoading } = useCustomQuery('booking', getBooking, {id: bookingId});

    const {mutate: checkout, isLoading: isCheckingOut} = useCustomQueryClient('booking', ({id, obj}) => updateBooking(id, obj), `Guest has checked out.`)

    const {
        mutate: deleteBookingById,
        isLoading: isDeleting
    } = useCustomQueryClient('booking', deleteBooking, `Booking ${bookingId} successfully deleted.`)


    function handleCheckout() {
        const obj = {status: 'checked-out'};
        checkout({id: bookingId, obj});
    }

    if (isLoading) return <Spinner />;

    if (!booking) return <Empty resource="Booking" />

    const {status, id} = booking;

    const statusToTagName = {
        unconfirmed: "blue",
        "checked-in": "green",
        "checked-out": "silver",
    };

  return (
    <>
      <Row type="horizontal">
        <HeadingGroup>
          <Heading as="h1">Booking #{id}</Heading>
          <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>
        </HeadingGroup>
        <ButtonText onClick={moveBack}>&larr; Back</ButtonText>
      </Row>

      <BookingDataBox booking={booking} />

      <ButtonGroup>
          {status === 'unconfirmed' && (
              <Button onClick={() => navigate(`/checkin/${bookingId}`)}>Check in</Button>
          )}

          {status === 'checked-in' && (
              <Button disabled={isCheckingOut} onClick={handleCheckout} icon={<HiArrowUpOnSquare />}>Check out</Button>
          )}

          <Modal>
              <Modal.Open opens="delete-booking">
                  <Button variation="danger" disabled={isDeleting} icon={<HiTrash />}>Delete booking</Button>
              </Modal.Open>

              <Modal.Content name="delete-booking">
                  <ConfirmDelete resourceName={`booking #${bookingId}`} onConfirm={() => {
                      deleteBookingById(bookingId);
                      moveBack();
                  }} isDeleting={isDeleting} />
              </Modal.Content>
          </Modal>

        <Button variation="secondary" onClick={moveBack}>
          Back
        </Button>
      </ButtonGroup>
    </>
  );
}

export default BookingDetail;
