import {getCabins} from "../../services/apiCabins.js";
import Spinner from "../../ui/Spinner.jsx";
import CabinRow from "./CabinRow.jsx";
import {useCustomQuery} from "../../hooks/useCustomQuery.js";
import Table from "../../ui/Table.jsx";
import Menus from "../../ui/Menus.jsx";
import {useSearchParams} from "react-router-dom";
import Empty from "../../ui/Empty.jsx";

function CabinTable() {
    const [searchParams] = useSearchParams();
    const {result: cabins, isLoading } = useCustomQuery('cabins', getCabins);

    if (isLoading) return <Spinner />;

    if (!cabins.length) return <Empty resource="cabins" />;

    const filterValue = searchParams.get('discount') || 'all';

    let filteredCabins;

    if (filterValue === 'all') filteredCabins = cabins;

    if (filterValue === 'no-discount') {
        filteredCabins = cabins.filter(cabin => cabin.discount === 0);
    }

    if (filterValue === 'with-discount') {
        filteredCabins = cabins.filter(cabin => cabin.discount !== 0);
    }

    const sortBy = searchParams.get('sortBy') || 'startDate-asc';
    const [field, direction] = sortBy.split('-')
    const modifier = direction === 'asc' ? 1 : -1;
    const sortedCabins = filteredCabins.sort((a, b) => (a[field] - b[field]) * modifier);

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

                <Table.Body data={sortedCabins} render={cabin => <CabinRow cabin={cabin} key={cabin.id} />} />
            </Table>
        </Menus>
    )
}

export default CabinTable;