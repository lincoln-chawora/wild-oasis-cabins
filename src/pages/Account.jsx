import Heading from "../ui/Heading";
import Row from "../ui/Row";
import UpdateUserDataForm from "../features/authentication/UpdateUserDataForm.jsx";
import UpdatePasswordForm from "../features/authentication/UpdatePasswordForm.jsx";

function Account() {
  return (
    <>
      <Heading as="h1">Your account</Heading>

      <Row>
        <Heading as="h2">Update user data</Heading>
        <UpdateUserDataForm />
      </Row>

      <Row>
        <Heading as="h2">Update password</Heading>
        <UpdatePasswordForm />
      </Row>
    </>
  );
}

export default Account;
