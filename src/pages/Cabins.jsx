import Heading from "../ui/Heading";
import Row from "../ui/Row";
import CabinTable from "../features/cabins/CabinTable.jsx";
import Button from "../ui/Button.jsx";
import {useState} from "react";
import CreateEditCabinForm from "../features/cabins/CreateEditCabinForm.jsx";

function Cabins() {
    const [showForm, setShowForm] = useState();
  return (
      <>
          <Row type="horizontal">
            <Heading as="h1">All cabins</Heading>
            <p>TEST</p>
          </Row>

          <Row>
            <CabinTable />

              <Button onClick={() => setShowForm(!showForm)}>Add new cabin</Button>

              {showForm && <CreateEditCabinForm />}
          </Row>
      </>
  );
}

export default Cabins;
