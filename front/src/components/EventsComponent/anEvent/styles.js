import styled from "styled-components";

export const Container = styled.div`
  border-radius: 6px;
  padding: 5px;
  border: solid 1px #979797;
  background-color: #fff;
  width: 48%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.875rem;
  box-shadow: 2px 3px 5px 0px rgb(200 200 200) ;
  @media (max-width: 768px) {
    width: 100%;
  }
  &:hover{
    cursor: pointer;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 25px;
`

export const OptionsContainer = styled.div``

export const Option = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const OptionDay = styled.div``

export const OptionTime = styled.div``

