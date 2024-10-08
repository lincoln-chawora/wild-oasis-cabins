import { useState } from "react";
import Button from "../../ui/Button.jsx";
import Form from "../../ui/Form.jsx";
import Input from "../../ui/Input";
import FormRowVertical from "../../ui/FormRowVertical.jsx";
import {useCustomUserQuery} from "./useCustomUserQuery.js";
import Spinner from "../../ui/Spinner.jsx";
import SpinnerMini from "../../ui/SpinnerMini.jsx";
import {login as loginApi} from "../../services/apiAuth.js";

function LoginForm() {
  const [email, setEmail] = useState("lincoln@example.com");
  const [password, setPassword] = useState("passw0rd");

  const {mutate: login, isLoading} = useCustomUserQuery(loginApi);

  if (isLoading) return <Spinner />

  function handleSubmit(e) {
      e.preventDefault();

      if (!email && !password) return;

      login({email, password}, {
          onSettled: () => {
              setEmail('');
              setPassword('');
          }
      });
  }

  return (
    <Form onSubmit={handleSubmit}>
      <FormRowVertical label="Email address">
        <Input
          type="email"
          id="email"
          // This makes this form better for password managers
          autoComplete="username"
          value={email}
          disabled={isLoading}
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormRowVertical>
      <FormRowVertical label="Password">
        <Input
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          disabled={isLoading}
          onChange={(e) => setPassword(e.target.value)}
        />
      </FormRowVertical>
      <FormRowVertical>
        <Button size="large"
        disabled={isLoading}>{!isLoading ? 'Login' : <SpinnerMini />}</Button>
      </FormRowVertical>
    </Form>
  );
}

export default LoginForm;
