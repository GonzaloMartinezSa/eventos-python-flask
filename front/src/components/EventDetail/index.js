import { EventContainer, AppContainer} from "./styles"
import BarChart from "./chart/index"
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";
import { Button } from '@mui/material';
import { Card, CardContent, CardActionArea } from '@mui/material';
import React from 'react';  

import {BACKEND as backend_api} from '../../config/config'


const EventDetail = (props) => {
  const { id } = useParams();
  const [event, setEvent] = useState("");
  const [options, setOptions] = useState([]);
  const [message, setMessage] = useState('');
  const [optionsLoading, setOptionsLoading] = useState(false)


  const handleGetEvent = async () => {
    setOptionsLoading(true)

    try {
      const response = await fetch(`${backend_api}/events/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token
        },
      });
      const data = await response.json();
      if(response.status === 429) {
        // too many requests
        // por ahora dejo algo asi, profesionalmente se podria hacer algo mejor (?)
        window.location.href = "/tooManyRequests"
      }
      //console.log(data); // logs the response
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

  const handleCloseVoting = async () => {
    if(localStorage.getItem('user_id') !== event.creator.id) {
      setMessage('No sos el creador del evento, no podés cerrarlo');
      return;
    }
    try {
      const response = await fetch(`${backend_api}/events/${id}/close`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token
        },
      });
      const data = await response.json();
      if(response.status === 200) {
        data.access_token && props.setToken(data.access_token)
        window.location.reload()
      }
      if(response.status === 429) {
        // too many requests
        // por ahora dejo algo asi, profesionalmente se podria hacer algo mejor (?)
        window.location.href = "/tooManyRequests"
      }
      response.status===200 
        ? setMessage('Votacion cerrada correctamente') 
        : setMessage('Fallo el Backend')
      //console.log(data); // logs response's body
    } catch (error) {
      setMessage('Fallo la conexion al Backend')
      console.error(error);
    }
  }

  useEffect(() => {
    if(!props.token || props.token==="" || props.token===undefined || props.token===null) {
      // o logout?
      console.log("Not logged in")
      window.location.href = "/login"
    } else {
      handleGetEvent()
    }
  }, [props])

  if(!props.token || props.token==="" || props.token===undefined || props.token===null) {
    // o logout?
    console.log("Not logged in")
    window.location.href = "/login"
  } else {
    return (
      <AppContainer>
        <Card sx={{ maxWidth: 'auto', ml:20, minWidth: 200 }}>
          <CardContent>
            <h1>Evento</h1>
            <h2>ID: {event.id}</h2>
            <h2>Nombre: {event.name}</h2>
            <h2>Disponible: {event.available ? "Sí" : "No"}</h2>
            <h2>Fecha de Creacion: {event.created_at}</h2>
            <h2>Fecha del Evento: {event.final_date || "Todavia no se decidio una fecha"}</h2>
          </CardContent>
          <CardActionArea>
            {event.available && localStorage.getItem('user_id') === event.creator.id ? (
              <Button onClick={handleCloseVoting}>Cerrar votacion</Button>
              // Para debuguear que pasa al tocar el boton
              // <div>
              //   <p> {message} </p>
              // </div>
            ) : (
              <></>
            ) }
          </CardActionArea>

            <Button variant="contained" onClick={() => window.location.href = '/events'}>Volver</Button>

          {optionsLoading ? (
            <EventContainer>
              <li>Cargando opciones...</li>
            </EventContainer>
          ) : (
            <BarChart optionsList = {options}/>
          )}
        </Card>
  
        
  
        
        
      </AppContainer>
    )
  }

}

export default EventDetail