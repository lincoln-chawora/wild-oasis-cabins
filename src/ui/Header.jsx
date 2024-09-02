import styled from "styled-components";
import Logout from "../features/authentication/Logout";
import {useQueryClient} from "@tanstack/react-query";
import {useState} from "react";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`

export function Header() {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData(["user"]);

    const [userName] = useState(() => {
        return user.email
    });

    return (
        <StyledHeader>
            <span>Logged in as: {userName}</span>

            <Logout />
        </StyledHeader>
    )
}