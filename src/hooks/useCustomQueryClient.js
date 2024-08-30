import {useMutation, useQueryClient} from "@tanstack/react-query";
import toast from "react-hot-toast";

export function useCustomQueryClient(qKey, mFn, successMessage = 'Transaction processed successfully') {
    const queryClient = useQueryClient();

    const {mutate, isLoading} = useMutation({
        mutationFn: mFn,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [qKey]
            }).then(() => {
                toast.success(successMessage);
            });
        },
        onError: (error) => toast.error(error.message)
    });

    return {mutate, isLoading}
}