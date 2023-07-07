import { Button } from "@mui/material";
import styled from "styled-components";

export const Container = styled.div`
  width: 600px;
  margin: 0px auto;
  background-color: #a8f0ef;
  padding:5px 20px;
  margin-top: 20px;
  border-radius: 5px;
  @media (max-width: 768px) {
    width: 90%;
  }
`

export const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  margin-top: 25px;
  align-items: center; 
  text-align: center;
  width: 100%
`

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`

export const StyledBtn = styled(Button)`
  width: 40%;
  margin: 20px auto 0px auto !important;
`