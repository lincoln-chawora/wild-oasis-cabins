import {useNavigate} from "react-router-dom";
import Spinner from "./Spinner.jsx";
import styled from "styled-components";
import {useEffect} from "react";
import {useUserQuery} from "../hooks/useUserQuery.js";

const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`

export function ProtectedRoute({children}) {
    const navigate = useNavigate();

    const {isAuthenticated, isLoading, isFetching } = useUserQuery();

    useEffect(() => {
        if (!isAuthenticated && !isLoading && !isFetching) navigate('/login');
    }, [isAuthenticated, isLoading, navigate, isFetching]);

    if (isLoading) return (
        <FullPage>
            <Spinner />
        </FullPage>
    )

    if (isAuthenticated) return children;
}