import styled from "styled-components";
import Logo from "./Logo.jsx";
import MainNav from "./MainNav.jsx";
import {HiArrowRight, HiX} from "react-icons/hi";
import ButtonIcon from "./ButtonIcon.jsx";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);
  
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`

export function Sidebar({isShowing, toggleSidebar}) {
    return (
        <StyledSidebar>
            <ButtonIcon onClick={() => toggleSidebar(!isShowing)}>
                {isShowing ? <HiX /> : <HiArrowRight />}
            </ButtonIcon>
            <Logo />
            <MainNav />
        </StyledSidebar>
    )
}