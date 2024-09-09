import Button from "../../ui/Button.jsx";
import Modal from "../../ui/Modal.jsx";
import CreateEditBookingForm from "./CreateEditBookingForm.jsx";

export function AddBooking() {
    return (
        <div>
            {/* Main modal component, children include open button and content which the button opens. */}
            <Modal>
                <Modal.Open opens="booking-form">
                    <Button>Create new booking</Button>
                </Modal.Open>
                <Modal.Content name="booking-form">
                    <CreateEditBookingForm />
                </Modal.Content>
            </Modal>
        </div>
    )
}