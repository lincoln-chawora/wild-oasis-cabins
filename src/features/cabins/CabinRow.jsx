import styled from "styled-components";
import {formatCurrency} from "../../utils/helpers";
import {createEditCabin, deleteCabin} from "../../services/apiCabins.js";
import {useState} from "react";
import CreateEditCabinForm from "./CreateEditCabinForm.jsx";
import {useCustomQueryClient} from "../../hooks/useCustomQueryClient.js";
import {HiSquare2Stack} from "react-icons/hi2";
import {HiPencil, HiTrash} from "react-icons/hi";

const TableRow = styled.div`
  display: grid;
  grid-template-columns: 0.6fr 1.8fr 2.2fr 1fr 1fr 1fr;
  column-gap: 2.4rem;
  align-items: center;
  padding: 1.4rem 2.4rem;

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
`;

const Img = styled.img`
  display: block;
  width: 6.4rem;
  aspect-ratio: 3 / 2;
  object-fit: cover;
  object-position: center;
  transform: scale(1.5) translateX(-7px);
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

function CabinRow({cabin}) {
    const [showForm, setShowForm] = useState(false);
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
        <>
            <TableRow role="row">
                <Img src={image} />
                <Cabin>{name}</Cabin>
                <div>Fits up to {maxCapacity} guests</div>
                <Price>{formatCurrency(regularPrice)}</Price>
                {discount ? <Price>{formatCurrency(discount)}</Price> : <span>&mdash;</span>}
                <div>
                    <button title="Duplicate cabin" onClick={handleDuplicate} disabled={isCreating}><HiSquare2Stack /></button>
                    <button title="Edit cabin" onClick={() => setShowForm(!showForm)}><HiPencil /></button>
                    <button title="Delete cabin" onClick={() => deleteCabinById(cabinId)} disabled={isDeleting}><HiTrash /></button>
                </div>
            </TableRow>
            {showForm && <CreateEditCabinForm cabinToEdit={cabin} />}
        </>
    )
}

export default CabinRow