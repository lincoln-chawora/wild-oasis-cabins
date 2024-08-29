import styled from "styled-components";
import {formatCurrency} from "../../utils/helpers";
import {createEditCabin, deleteCabin} from "../../services/apiCabins.js";
import CreateEditCabinForm from "./CreateEditCabinForm.jsx";
import {useCustomQueryClient} from "../../hooks/useCustomQueryClient.js";
import {HiSquare2Stack} from "react-icons/hi2";
import {HiPencil, HiTrash} from "react-icons/hi";
import Modal from "../../ui/Modal.jsx";
import ConfirmDelete from "../../ui/ConfirmDelete.jsx";
import Table from "../../ui/Table.jsx";

const Img = styled.img`
  display: block;
  width: ${(props) => props.size == 'small' ? '6.4rem' : '30rem'};
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
  cursor: pointer;
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: "Sono";
`;

const Price = styled.div`
  font-family: "Sono";
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: "Sono";
  font-weight: 500;
  color: var(--color-green-700);
`;

Img.defaultProps = {
    size: "small",
};

function CabinRow({cabin}) {
    const {id: cabinId, name, maxCapacity, regularPrice, discount, image, description} = cabin;

    const {
        mutate: deleteCabinById,
        isLoading: isDeleting
    } = useCustomQueryClient(undefined, deleteCabin, `Cabin ${name} successfully deleted.`)

    const {
        mutate: duplicateCabin,
        isLoading: isCreating
    } = useCustomQueryClient(undefined, createEditCabin, `Cabin ${name} successfully duplicated.`)
    
    function handleDuplicate() {
        duplicateCabin({
            name: `Copy of ${name}`,
            maxCapacity,
            regularPrice,
            discount,
            image,
            description,
        });
    }

    return (
        <Table.Row>
                <Modal>
                    <Modal.Open opens="cabin-image">
                        <Img title="Enlarge image" src={image} />
                    </Modal.Open>
                    <Modal.Content name="cabin-image">
                        <Img size="large" src={image} />
                    </Modal.Content>
                </Modal>
                <Cabin>{name}</Cabin>
                <div>Fits up to {maxCapacity} guests</div>
                <Price>{formatCurrency(regularPrice)}</Price>
                {discount ? <Discount>{formatCurrency(discount)}</Discount> : <span>&mdash;</span>}
                <div>
                    <button title="Duplicate cabin" onClick={handleDuplicate} disabled={isCreating}><HiSquare2Stack /></button>
                    <Modal>
                        <Modal.Open opens="edit-cabin-form">
                            <button title="Edit cabin" ><HiPencil /></button>
                        </Modal.Open>
                        <Modal.Content name="edit-cabin-form">
                            <CreateEditCabinForm cabinToEdit={cabin} />
                        </Modal.Content>

                        <Modal.Open opens="delete-cabin-confirmation">
                            <button title="Delete cabin" ><HiTrash /></button>
                        </Modal.Open>
                        <Modal.Content name="delete-cabin-confirmation">
                            <ConfirmDelete resourceName={name} onConfirm={() => deleteCabinById(cabinId)} isDeleting={isDeleting} />
                        </Modal.Content>
                    </Modal>
                </div>
        </Table.Row>
    )
}

export default CabinRow