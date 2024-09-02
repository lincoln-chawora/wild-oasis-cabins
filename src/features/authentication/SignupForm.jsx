import Button from "../../ui/Button.jsx";
import Form from "../../ui/Form.jsx";
import FormRow from "../../ui/FormRow";
import Input from "../../ui/Input";
import {useForm} from "react-hook-form";
import {useCustomUserQuery} from "./useCustomUserQuery.js";
import {signUp as signUpApi} from "../../services/apiAuth.js";

function SignupForm() {
    const {register, formState, getValues, handleSubmit, reset} = useForm({ defaultValues: {} });
    const { errors } = formState;

    const {mutate: signup, isLoading} = useCustomUserQuery(
        signUpApi,
        false,
        "Account successfully created! Please verify the new account from the user's email address",
        "Something went wrong creating account."
    );

    function onSubmit({fullName, email, password}) {
        signup({fullName, email, password}, {
            onSettled: reset
        })
    }

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormRow label="Full name" error={errors?.fullName?.message}>
        <Input type="text" id="fullName" disabled={isLoading} {...register("fullName",
            { required: "This field is required"})} />
      </FormRow>

      <FormRow label="Email address" error={errors?.email?.message}>
        <Input type="email" id="email" disabled={isLoading} {...register("email",
            { required: "This field is required", pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Please provide a valid email address'
                }})} />
      </FormRow>

      <FormRow label="Password (min 8 characters)" error={errors?.password?.message}>
        <Input type="password" id="password" disabled={isLoading} {...register("password",
            { required: "This field is required", minLength: {
                    value: 8,
                    message: 'Password needs a minimum of 8 characters'
                }})} />
      </FormRow>

      <FormRow label="Repeat password" error={errors?.passwordConfirm?.message}>
        <Input type="password" id="passwordConfirm" disabled={isLoading} {...register("passwordConfirm",
            { required: "This field is required",
                validate: (value) => value === getValues().password || 'Passwords need to match'})} />
      </FormRow>

      <FormRow>
        {/* type is an HTML attribute! */}
        <Button variation="secondary" onClick={reset} disabled={isLoading} type="reset">
          Reset form
        </Button>
        <Button disabled={isLoading}> Create new user</Button>
      </FormRow>
    </Form>
  );
}

export default SignupForm;
