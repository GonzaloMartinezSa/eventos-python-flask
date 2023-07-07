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
  flex-direction: column;
  justify-content: top;
  margin-top: 25px;
  align-items: center; 
  height: 100vh;

`
