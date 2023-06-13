import { Box, Typography, TextField } from "@mui/material"
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { Container, StyledBtn, StyledForm } from "./styles"
import React, { useState } from 'react';

const CreateForm = (props) => {
  const [name, setName] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(`${time.getHours()}:${time.getMinutes()}`);
  };
  
  const formatDate = (date_time) => {
    const date = new Date(date_time)
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;

}

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      
      const response = await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token
        },
        body: JSON.stringify({ "name": name, "datetime": formatDate(selectedDate) + "T" + selectedTime, "creator_id": localStorage.getItem("user_id") }),
      });
      const data = await response.json();
      console.log(data); // logs the response
      if(response.status === 201) {
        data.access_token && props.setToken(data.access_token)
        window.location.href = '/events'
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
      <Container>
        <StyledForm onSubmit={handleSubmit}>
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
        <Box sx={{ alignContent: 'center'}}>
          <Typography variant="h5" id="modal-title" gutterBottom>Seleccione una fecha y hora</Typography>
          <DatePicker sx={{m:2 }}
            label="Fecha"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <TimePicker sx={{m:2 }}
            label="Hora"
            value={selectedTime}
            onChange={handleTimeChange}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>

          <StyledBtn variant="outlined" type="submit">Crear Evento</StyledBtn>
        </StyledForm>


        
      </Container>
    )
  }

}

export default CreateForm