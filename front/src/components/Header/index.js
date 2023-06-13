import { Button } from "@mui/material"
import { ButtonsContainer, Container, Title } from "./styles.js"

const Header = () => {
  
  const handleRedirect = (url) => {
    window.location.href = url
  }

  return (
    <Container>
      <Title>
        <a href='/' style={{ textDecoration: 'none', }}> LAST SUPPER </a>
      </Title>
        {
          localStorage.getItem('user_id') == null ?
          <ButtonsContainer>
            <Button onClick={() => handleRedirect('/login')} variant="contained">Login</Button>
          </ButtonsContainer>
          :
          <ButtonsContainer>
            <Button onClick={() => handleRedirect('/events-info')} variant="outlined">Información de eventos</Button>
            <Button onClick={() => handleRedirect('/events/create')} variant="outlined">Crear Evento</Button>
            <Button onClick={() => handleRedirect('/logout')} variant="contained">Logout</Button>
          </ButtonsContainer>
        }
    </Container>
  )
}

export default Header