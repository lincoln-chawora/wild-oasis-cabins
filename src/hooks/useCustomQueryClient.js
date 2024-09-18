import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";
import {useNavigate} from "react-router-dom";

export function useCustomQueryClient(qKey, mFn, successMessage = 'Transaction processed successfully', invalidateAllQueries = false) {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const {mutate, isLoading} = useMutation({
        mutationFn: mFn,
        onSuccess: () => {
            if (invalidateAllQueries) {
                queryClient.removeQueries();
                navigate('/login')
            } else {
                queryClient.invalidateQueries({
                    queryKey: [qKey]
                }).then(() => {
                    toast.success(successMessage);
                });
            }
        },
        onError: (error) => toast.error(error.message)
    });

    return {mutate, isLoading}
}