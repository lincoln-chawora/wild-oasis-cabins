import {Outlet} from "react-router-dom";
import {Header} from "./Header";
import {Sidebar} from "./Sidebar";
import styled, {css} from "styled-components";
import {useState} from "react";

const StyledAppLayout = styled.div`
  display: grid;
  ${props => props.$isShowing ? css`grid-template-columns: 26rem 1fr;` : css`grid-template-columns: 1rem 1fr;`}
  grid-template-rows: auto 1fr;
  height: 100vh;
`

const Main = styled.main`
    background-color: var(--color-grey-50);
    padding: 4rem 4.8rem 6.4rem;
    overflow: scroll;
`

const Container = styled.div`
  max-width: 120rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`

export function AppLayout() {
    const [isShowing, setIsShowing] = useState(false);

    return (
        <StyledAppLayout $isShowing={isShowing}>
            <Header />
            <Sidebar isShowing={isShowing} toggleSidebar={setIsShowing} />
            <Main>
                <Container>
                    <Outlet />
                </Container>
            </Main>
        </StyledAppLayout>
    )
}