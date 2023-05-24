import { Container , EventContainer, AppContainer, ButtonsContainer} from "./styles"
import BarChart from "./chart/index"
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Button } from '@mui/material';
import { CardHeader, Card, CardContent,CardActionArea, Typography} from '@mui/material';
import React from 'react';  
import App from "../../App";




const EventDetail = (props) => {
  const { id } = useParams();
  const [event, setEvent] = useState("");
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState('');
  const [optionsLoading, setOptionsLoading] = useState(false)



  const handleGetEvent = async () => {
    setOptionsLoading(true)

    try {
      const response = await fetch(`http://localhost:5000/events/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token
        },
      });
      const data = await response.json();
      console.log(data); // logs the response
      if(response.status === 200) {
        data.access_token && props.setToken(data.access_token)
        setEvent(data)
        setOptions(data.options)
      }
    } catch (error) {
      console.error(error);
    }

    setOptionsLoading(false)
  }

  useEffect(() => {
    handleGetEvent()
  }, [])

  const handleCloseVoting = async () => {
    if(localStorage.getItem('user_id') != event.creator_id) {
      setMessage('No sos el creador del evento, no podés cerrarlo');
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/events/${id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token
        },
      });
      const data = await response.json();
      if(response.status === 200) {
        data.access_token && props.setToken(data.access_token)
      }
      response.status===200 
        ? setMessage('Votacion cerrada correctamente') 
        : setMessage('Fallo el Backend')
      console.log(data); // logs response's body
    } catch (error) {
      setMessage('Fallo la conexion al Backend')
      console.error(error);
    }
  }

  const handleRedirect = () => {
    window.location.href = `/events/${id}/options`
  }

  return (
    <AppContainer>
      <Card sx={{ maxWidth: 345, ml:20, minWidth: 200}}>
      <CardContent>
        <h1>Evento</h1>
        <h2>ID: {event.id}</h2>
        <h2>Nombre: {event.name}</h2>
        <h2>Disponible: {event.available ? "Sí" : "No"}</h2>
        <h2>Fecha de Creacion: {event.created_at}</h2>
        <h2>Fecha del Evento: {event.final_date || "Todavia no se decidio una fecha"}</h2>
      </CardContent>
      {/* <Container>
        <button onClick={handleRedirect}>Agregar opcion</button>
      </Container> */}
      <CardActionArea>
        <Button onClick={handleCloseVoting}>Cerrar votacion</Button>
        <div>
          <p> {message} </p>
        </div>
      </CardActionArea>

      <CardActionArea>
      <br></br>
      <Button variant="contained" onClick={() => window.history.back()}>Go back</Button>
      </CardActionArea>
      </Card>

      

      {optionsLoading ? (
        <EventContainer>
          <li>Cargando opciones...</li>
        </EventContainer>
      ) : (
        // <div>
        //   {
        //     options.map((option) => (
        //      <li> {option.datetime} </li>
        //     ))
        //   }
        // </div>
        <BarChart optionsList = {options}/>
      )}
      
    </AppContainer>
  )
}
export default EventDetail