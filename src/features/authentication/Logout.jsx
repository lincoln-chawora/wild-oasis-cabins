import {HiArrowRightOnRectangle} from "react-icons/hi2";
import {useCustomQueryClient} from "../../hooks/useCustomQueryClient.js";
import {logOut as logoutApi} from "../../services/apiAuth.js";
import ButtonIcon from "../../ui/ButtonIcon.jsx";
import SpinnerMini from "../../ui/SpinnerMini.jsx";

export default function Logout() {
    const {mutate: signOut, isLoading: isLoggingOut} = useCustomQueryClient('user', logoutApi, "You've been logged out.", true)

    return (
        <ButtonIcon title="Logout" disabled={isLoggingOut} onClick={signOut}>
            {!isLoggingOut ? <HiArrowRightOnRectangle /> : <SpinnerMini />}
        </ButtonIcon>
    )
}