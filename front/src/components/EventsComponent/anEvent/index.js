import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { Box, Button, Checkbox, Modal, Typography, TextField } from '@mui/material';
import { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles'
import { Card, CardActions, CardContent, CardActionArea, CardMedia } from '@mui/material/';
import { ButtonsContainer, Option, OptionsContainer } from './styles';

import {BACKEND as backend_api} from '../../../config/config'


const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: ' #ffffff',
    border: '1px solid #000',
    borderRadius: '8px',
    padding: '10px 35px',
    minWidth: '250px'
  },
}));

const Event = ({ event, props }) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openVote, setOpenVote] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [options, setOptions] = useState([])
  const [selectedIndexes, setSelectedIndexes] = useState([]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    setOptions(event.options);
  }, [event.options])

  const handleRedirect = async () => {
    window.location.href = `/events/${event.id}`
  };
  
  const handleListItemClick = (index) => {
    if (selectedIndexes.includes(index)){
      setSelectedIndexes(selectedIndexes.filter(item => item !== index));
    }
    else{
      const aux = selectedIndexes.slice(); // Shallow copy
      
      aux.push(index); // Add a new element to the copied list
      
      setSelectedIndexes(aux);

    }
    //console.log(selectedIndexes);
  };

  const handleVoteOpen = () => {
    setOpenVote(true);
  };

  const handleCloseVote = () => {
    setOpenVote(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (time) => {
    setSelectedTime(`${time.getHours()}:${time.getMinutes()}`);
  };

  const handleSave = () => {
    if (selectedDate && selectedTime) {
      //console.log(`Fecha seleccionada: ${selectedDate}. Hora seleccionada: ${selectedTime}.`);
      const date = new Date(selectedDate)
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      //setOptions((prevOptions) => ([...prevOptions, { day: formattedDate, time: selectedTime }]))

      handleSubmit(formattedDate, selectedTime);

      handleClose();
    } else {
      //mostrar mensaje de que faltan ingresar campos
    }
  };

  const handleSubmit = async (formattedDate, selectedTime) => {
    try {
        const response = await fetch(`${backend_api}/events/${event.id}/options`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token
        },
        body: JSON.stringify({ 'datetime': formattedDate + "T" + selectedTime })
        });
        const data = await response.json();
        //console.log(data);
        if(response.status === 201) {
          data.access_token && props.setToken(data.access_token)
        }
        if(response.status === 429) {
          // too many requests
          // por ahora dejo algo asi, profesionalmente se podria hacer algo mejor (?)
          window.location.href = "/tooManyRequests"
        }
        // Tengo que redirigir para que vuelva a hacer el GET de eventos 
        // (actualizar las opciones). Seguro Diego sabe hacerlo mejor, pero bue
        window.location.href = '/events'
    } catch (error) {
        console.error(error);
    } 
}

const handleVoteOption = async (optionsId) => {
  try {
    const response = await fetch(`${backend_api}/events/${event.id}/options/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + props.token
      },
      body: JSON.stringify({
        'voter_id': localStorage.getItem('user_id'),
        'option_ids': optionsId,
      }),
    });
    const data = await response.json();
    //console.log(data)
    if(response.status === 200) {
      data.access_token && props.setToken(data.access_token)
      window.location.href = '/events'
    }
    if(response.status === 429) {
      // too many requests
      // por ahora dejo algo asi, profesionalmente se podria hacer algo mejor (?)
      window.location.href = "/tooManyRequests"
    }
    if (response.status >= 400) {
      setMessage(data.message);
    } else {
      setMessage(null);
    }
  } catch (error) {
    console.error(error);
  } 
}

  const handleSaveVote = () => {
      const aux = selectedIndexes.map(index => options[index].id)

      handleVoteOption(aux)
      //console.log(selectedIndex)
      
      //handleCloseVote()
    

  }

  const handleOpenModalToVote = () => {
    //console.log(`Length de 'options' es: ${options.length}`)
    if (options.length > 0) {
      handleVoteOpen()
    }
  }

  return (
    <>
      <Card sx={{ minWidth: 275 }} key={event.id}>

        <CardActionArea onClick={handleRedirect}>


        <CardMedia
          component="img"
          height="140"
          image="https://cdn.sightseeingtoursitaly.com/wp-content/uploads/2019/05/Last-Supper-1.jpg"
          alt="green iguana"
        />

        <CardContent>
       
        {event.name}

        </CardContent>

        </CardActionArea>

        <CardActions>

        {event.available ? <Button variant="outlined" color="primary" size="small" onClick={handleOpenModalToVote}>Votar opción</Button> : <></>}
        {event.available && event.creator.id === localStorage.getItem('user_id') ? <Button variant="outlined" color="primary" size="small" onClick={handleOpen}>Proponer opción</Button> : <></>}
        <Button variant="outlined" color="primary" size="small" onClick={handleRedirect}>Ver evento</Button>
       
        </CardActions>
      
      </Card>
      <Modal
        className={classes.modal}
        open={openVote}
        onClose={handleCloseVote}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className={classes.paper}>
          {
            options.length &&
            <OptionsContainer>
              {options.map((option, index) => (
                <Option key={option.id} >
                   {option.datetime}
                  <Checkbox  onChange={() => handleListItemClick(index)} />
                </Option>
              ))}
              {message ? <text>{message}</text> : <></>}
            </OptionsContainer>
            
          }
          <ButtonsContainer>
            <Button variant="outlined" onClick={handleCloseVote}>Cerrar</Button>
            <Button variant="contained" color="primary" onClick={handleSaveVote}>Guardar</Button>
          </ButtonsContainer>
        </Box>
      </Modal>
      <Modal
        className={classes.modal}
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box className={classes.paper}>
          <Typography variant="h5" id="modal-title" gutterBottom>Seleccione una fecha y hora</Typography>
          <DatePicker
            label="Fecha"
            value={selectedDate}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <TimePicker
            label="Hora"
            value={selectedTime}
            onChange={handleTimeChange}
            renderInput={(params) => <TextField {...params} />}
          />
          <ButtonsContainer>
            <Button variant="outlined" onClick={handleClose}>Cerrar</Button>
            <Button variant="contained" color="primary" onClick={handleSave}>Guardar</Button>
          </ButtonsContainer>
        </Box>
      </Modal>
    </>
  )
}

export default Event;
