import styled from "styled-components";
import Logout from "../features/authentication/Logout";

const StyledHeader = styled.header`
  background-color: var(--color-grey-0);
  padding: 1.2rem 4.8rem;
  border-bottom: 1px solid var(--color-grey-100);
`

export function Header() {
    return (
        <StyledHeader>
            <span>Header</span>

            <Logout />
        </StyledHeader>
    )
}