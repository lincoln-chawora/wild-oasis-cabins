import Select from "./Select.jsx";
import {useSearchParams} from "react-router-dom";

export function SortBy({options}) {
    const [searchParams, setSearchParams] = useSearchParams();

    const sortBy = searchParams.get('sortBy') || '';

    function handleChange(e) {
        searchParams.set('sortBy', e.target.value);
        setSearchParams(searchParams);
    }

    return (
        <Select options={options} value={sortBy} type="white" onChange={handleChange} />
    )
}