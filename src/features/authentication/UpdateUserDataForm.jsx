import { useState } from "react";

import Button from "../../ui/Button.jsx";
import FileInput from "../../ui/FileInput.jsx";
import Form from "../../ui/Form.jsx";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import { useUserQuery as useUser } from "../../hooks/useUserQuery.js";
import {useCustomQueryClient} from "../../hooks/useCustomQueryClient.js";
import {updateUser as updateUserApi} from "../../services/apiAuth.js";

function UpdateUserDataForm() {
  // We don't need the loading state, and can immediately use the user data, because we know that it has already been loaded at this point
  const {
    user: {
      email,
      user_metadata: { fullName: currentFullName },
    },
  } = useUser();

  const {mutate: updateUser, isLoading: isUpdating} = useCustomQueryClient('user', updateUserApi, `Your details have been successfully updated.`)

  const [fullName, setFullName] = useState(currentFullName);
  const [avatar, setAvatar] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();

    if (!fullName) return;

    updateUser({fullName, avatar}, {
        onSuccess: () => {
            setAvatar(null);
            e.target.reset();
        }
    });
  }

  function handleCancel() {
      setFullName(currentFullName);
      setAvatar(null);
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRow label="Email address">
        <Input value={email} disabled />
      </FormRow>
      <FormRow label="Full name">
        <Input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          id="fullName" disabled={isUpdating}
        />
      </FormRow>
      <FormRow label="Avatar image">
        <FileInput
          id="avatar"
          accept="image/*" disabled={isUpdating}
          onChange={(e) => setAvatar(e.target.files[0])}
        />
      </FormRow>
      <FormRow>
        <Button type="reset" disabled={isUpdating} onClick={handleCancel} variation="secondary">
          Cancel
        </Button>
        <Button disabled={isUpdating}>Update account</Button>
      </FormRow>
    </Form>
  );
}

export default UpdateUserDataForm;
