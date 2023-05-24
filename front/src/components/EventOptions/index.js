import { Button } from "@mui/material"
import { Container } from "./styles"
import { useParams } from 'react-router-dom';
import { useState, useEffect } from "react";




const EventOptions = (props) => {
    const { id } = useParams()
    const [dateTime, setDateTime] = useState('')
    
    const handleSubmit = async (option) => {
        try {
            option.preventDefault()
            console.log(dateTime)
            const response = await fetch(`http://localhost:5000/events/${id}/options`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + props.token
            },
            body: JSON.stringify({ 'datetime': dateTime }) // Tipo de input: "2017-06-01T08:30"
            });
            const data = await response.json();
            console.log(data);
            if(response.status === 201) {
                data.access_token && props.setToken(data.access_token)
            }
        } catch (error) {
            console.error(error);
        } 
    }

    const handleChange = (dateTime) => {
        setDateTime(dateTime.target.value);
    }

    return (
        <Container>
            <form onSubmit={handleSubmit}>
                <label>
                Date and time:
                <input type="dateTime-local" defaultValue={dateTime} onChange={handleChange} />
                </label>
                <Button type="submit">Submit</Button>
            </form>
        </Container>
    )
}

export default EventOptions