import styled from "styled-components";
import GlobalStyles from "./styles/GlobalStyles.js";

const H1 = styled.h1`
  font-size:1.4rem;
  color: var(--color-brand-600);
  background: var(--color-brand-50);
`;

const Button = styled.button`
  font-size:1.4rem;
  padding: 1.2rem 1.6rem;
  color: white;
`

const Input = styled.input`
  border: 1px solid #ddd;
  border-radius: 5px;
`

const StyledApp = styled.div`
  background-color: blue;
  padding: 20px;
`

function App() {
  return (
      <>
          <GlobalStyles />
          <StyledApp>
            <H1>Hello there</H1>
            <Button>Check in</Button>
            <Input type="number" placeholder="Numberr of fomsehting"/>
          </StyledApp>
      </>
  )
}

export default App
