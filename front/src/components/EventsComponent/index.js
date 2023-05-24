import { useState } from "react";
import { Container, EventsContainer, LoadingText } from "./styles";
import { useEffect } from "react";
import Event from './anEvent/index'
import axios from 'axios'

const Events = (props) => {
  const [eventsLoading, setEventsLoading] = useState(false)
  const [events, setEvents] = useState([{ name: 'evento 1' }])

  const handleGetEvents = async () => {
    setEventsLoading(true)

    console.log(props.token)

    try {
      const response = await fetch('http://localhost:5000/events', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token
        },
      });

      const data = await response.json();
      console.log(data); // logs the nresponse
      if(response.status === 200) {
        data.access_token && props.setToken(data.access_token)
        setEvents(data)
      }
    } catch (error) {
      console.error(error);
      return (window.location.href = '/login')
    }

    setEventsLoading(false)
  }

  useEffect(() => {
    handleGetEvents()
  }, [])

  return (
    <Container>
      {eventsLoading ? (
        <LoadingText>Cargando eventos...</LoadingText>
      ) : (
        <EventsContainer>
          {
            events.length > 0 ?
            events.map((event) => (
              <Event event={event} props={props} />
            )) :
            <span>No hay eventos para mostrar</span>
          }
        </EventsContainer>
      )}
    </Container>
  );
};

export default Events;
