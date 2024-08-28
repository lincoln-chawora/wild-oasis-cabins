import Button from "../../ui/Button.jsx";
import CreateEditCabinForm from "./CreateEditCabinForm.jsx";
import {useState} from "react";
import Modal from "../../ui/Modal.jsx";

export function AddCabin() {
    const [isOpenModal, setIsOpenModal] = useState(false);

    return (
        <>
            <Button onClick={() => setIsOpenModal((show) => !show)}>Add new cabin</Button>

            {isOpenModal &&
                <Modal onClose={() => setIsOpenModal(false)}>
                    <CreateEditCabinForm onCloseModal={() => setIsOpenModal(false)} />
                </Modal>
            }
        </>
    )
}