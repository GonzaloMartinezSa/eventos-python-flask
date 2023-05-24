import { AppContainer, Container } from "./styles"
import { useState, useEffect } from "react";
import { CardHeader, Card, CardContent, Typography} from '@mui/material';

const EventDetail = (props) => {
  const [info, setInfo] = useState("");

  const handleGetEventsInfo = async () => {
    //setEventsLoading(true)

    console.log('hola')

    try {
      const response = await fetch(`http://localhost:5000/events-info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token
        },
      });
      const data = await response.json();
      console.log(data); // logs response
      if(response.status === 200) {
        data.access_token && props.setToken(data.access_token)
        setInfo(data)
      }
    } catch (error) {
      console.error(error);
    }

    //setEventsLoading(false)
  }

  useEffect(() => {
    handleGetEventsInfo()
  }, [])


  return (
    <Container>
      <h1> En las ultimas 2 horas: </h1>
      <h2>Votos: {info.votes}</h2>
      <h2>Eventos: {info.events}</h2>
    </Container>
  )
}
export default EventDetail
