import Button from "../../ui/Button.jsx";
import CreateEditCabinForm from "./CreateEditCabinForm.jsx";
import Modal from "../../ui/Modal.jsx";

export function AddCabin() {
    return (
        <div>
            {/* Main modal component, children include open button and content which the button opens. */}
            <Modal>
                <Modal.Open opens="cabin-form">
                    <Button>Add new cabin</Button>
                </Modal.Open>
                <Modal.Content name="cabin-form">
                    <CreateEditCabinForm />
                </Modal.Content>
            </Modal>
        </div>
    )
}