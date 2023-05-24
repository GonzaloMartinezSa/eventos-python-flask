import { Button } from "@mui/material";
import styled from "styled-components";

export const Container = styled.div`
  width: 600px;
  margin: 0px auto;
  background-color: #C4F8B2;
  padding:5px 20px;
  margin-top: 20px;
  border-radius: 5px;
  @media (max-width: 768px) {
    width: 90%;
  }
`

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`

export const StyledBtn = styled(Button)`
  width: 40%;
  margin: 20px auto 0px auto !important;
`