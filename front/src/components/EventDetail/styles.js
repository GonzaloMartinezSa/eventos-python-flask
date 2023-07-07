import styled from "styled-components";

export const EventContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: left;
  justify-content: left;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 10px;
  text-align: left;
`;

export const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: top;
  margin-top: 25px;
  align-items: center; 
  text-align: center
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  column-gap: 10px; 
  align-items: right;
`
