import { TextField } from "@mui/material"
import { Container, StyledBtn, StyledForm } from "./styles"
import React, { useState } from 'react';

const CreateForm = (props) => {
  const [name, setName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token
        },
        body: JSON.stringify({ "name": name, "creator_id": localStorage.getItem("user_id") }),
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

  const handleRedirect = () => {
    window.location.href = `/events`
  }

  return (
    <Container>
      <StyledForm onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <StyledBtn variant="outlined" type="submit">Crear Evento</StyledBtn>
      </StyledForm>
    </Container>
  )
}

export default CreateForm