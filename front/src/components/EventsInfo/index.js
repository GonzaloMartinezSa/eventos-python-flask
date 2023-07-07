import { Card, Typography, CardContent } from "@mui/material"
import { useState, useEffect } from "react";

import {BACKEND as backend_api} from '../../config/config'
import { AppContainer } from "./styles";


const EventDetail = (props) => {
  const [info, setInfo] = useState("");

  const handleGetEventsInfo = async () => {
    //setEventsLoading(true)

    try {
      const response = await fetch(`${backend_api}/events-info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token
        },
      });
      const data = await response.json();
      //console.log(data); // logs response
      if(response.status === 200) {
        data.access_token && props.setToken(data.access_token)
        setInfo(data)
      }
      if(response.status === 429) {
        // too many requests
        // por ahora dejo algo asi, profesionalmente se podria hacer algo mejor (?)
        window.location.href = "/tooManyRequests"
      }
    } catch (error) {
      console.error(error);
    }

    //setEventsLoading(false)
  }

  useEffect(() => {
    if(!props.token || props.token==="" || props.token===undefined || props.token===null) {
      // o logout?
      console.log("Not logged in")
      window.location.href = "/login"
    } else {
      handleGetEventsInfo()
    }
  }, [props])

  if(!props.token || props.token==="" || props.token===undefined || props.token===null) {
    // o logout?
    console.log("Not logged in")
    window.location.href = "/login"
  } else {
    return (
      <AppContainer>
        <Card sx={{ width: 500 }}>
          <CardContent>
            <Typography variant='h4'>En las últimas 2 horas:</Typography>
            <Typography variant='h5'>Eventos: {info.events}</Typography>
            <Typography variant='h5'>Votos: {info.votes}</Typography>
            {info.votes_info && info.votes_info.map((vote) => (
              <Typography>• {vote}</Typography>
            ))}
          </CardContent>
        </Card>
      </AppContainer>
    )
  }
}
export default EventDetail
