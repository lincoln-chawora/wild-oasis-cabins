import {useNavigate} from "react-router-dom";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useCustomUserQuery(mFn, isLogin = true, successMessage = 'Login successful', errorMessage = 'Provided email or password are incorrect') {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {mutate, isLoading} = useMutation({
        mutationFn: (params) => mFn(params),
        onSuccess: (data) => {
            if (isLogin) {
                queryClient.setQueryData(['user'], data.user);
                navigate('/dashboard', {replace: true});
            }
            toast.success(successMessage);
        },
        onError: (err) => {
            console.log('ERROR', err);

            // @todo: FIX LATER. Normally wouldn't do this but this error is a bit gross:
            // TypeError: Cannot read properties of null reading 'keepDefaultValues'
            if (isLogin) {
                toast.error(errorMessage);
            }
        }
    })

    return {mutate, isLoading}
}