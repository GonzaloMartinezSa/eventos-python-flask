import { Box, Typography, TextField, Button, Card, CardContent } from "@mui/material";
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { AppContainer, StyledBtn, StyledForm } from "./styles"
import React, { useState } from 'react';

import {BACKEND as backend_api} from '../../config/config'

const CreateForm = (props) => {
  const [name, setName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [options, setOptions] = useState([])

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(`${time.getHours()}:${time.getMinutes()}`);
  };

  const handleAddOption = () => {
    setOptions([...options, {date: selectedDate, time: selectedTime}])
    setSelectedDate(null)
    setSelectedTime(null)
  }
  
  const formatDate = (date_time) => {
    const date = new Date(date_time)
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formattedOptions = options.map((o) => formatDate(o.date) + "T" + o.time)

    try {
      const response = await fetch(`${backend_api}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token
        },
        body: JSON.stringify({ "name": name, "options": formattedOptions, "creator_id": localStorage.getItem("user_id") }),
      });
      const data = await response.json();
      if(response.status === 201) {
        data.access_token && props.setToken(data.access_token)
        window.location.href = '/events'
      }
      if(response.status === 429) {
        // too many requests
        // por ahora dejo algo asi, profesionalmente se podria hacer algo mejor (?)
        window.location.href = "/tooManyRequests"
      }
    } catch (error) {
      console.error(error);
    }
  };

  if(!props.token || props.token==="" || props.token===undefined || props.token===null) {
    // o logout?
    console.log("Not logged in")
    window.location.href = "/login"
  } else {
    return (
      <AppContainer>
        <Card sx={{width: 600}}>
          <CardContent>
            <StyledForm onSubmit={handleSubmit}>
              <TextField
                label="Nombre"
                value={name}
                onChange={(e) => setName(e.target.value)}
                margin="normal"
              />
              <Typography variant="h5" id="modal-title" gutterBottom>Opciones</Typography>
              {options.map((o) =>
                (<Typography>{formatDate(o.date)} {o.time}</Typography>)
              )}
              <Box sx={{ alignContent: 'center', alignItems: 'center'}}>

                <DatePicker sx={{m:2, width:'200px' }}
                  label="Fecha"
                  value={selectedDate}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} />}
                />
                <TimePicker sx={{m:2, width:'200px' }}
                  label="Hora"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  renderInput={(params) => <TextField {...params} />}
                />
                <Button variant="outlined" sx={{m:2, height:'56px'}} onClick={handleAddOption}>+</Button>
              </Box>

              <StyledBtn variant="outlined" type="submit">Crear Evento</StyledBtn>
            </StyledForm>
          </CardContent>
        </Card>
      </AppContainer>
    )
  }

}

export default CreateForm