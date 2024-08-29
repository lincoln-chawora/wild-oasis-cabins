import {getCabins} from "../../services/apiCabins.js";
import Spinner from "../../ui/Spinner.jsx";
import CabinRow from "./CabinRow.jsx";
import {useCustomQuery} from "../../hooks/useCustomQuery.js";
import Table from "../../ui/Table.jsx";
import Menus from "../../ui/Menus.jsx";

function CabinTable() {
    const {data: cabins, isLoading } = useCustomQuery(undefined, getCabins);

    if (isLoading) return <Spinner />;

    return (
        <Menus>
            <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
                <Table.Header>
                    <div>Image</div>
                    <div>Cabin</div>
                    <div>Capacity</div>
                    <div>Price</div>
                    <div>Discount</div>
                    <div>Actions</div>
                </Table.Header>

                <Table.Body data={cabins} render={cabin => <CabinRow cabin={cabin} key={cabin.id} />} />
            </Table>
        </Menus>
    )
}

export default CabinTable;