import { useState } from "react";
import { Container, EventsContainer, LoadingText } from "./styles";
import { useEffect } from "react";
import Event from './anEvent/index'


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
        setEvents(data.events)
      }
    } catch (error) {
      console.error(error);
      return (window.location.href = '/login')
    }

    setEventsLoading(false)
  }

  useEffect(() => {
    if(!props.token || props.token==="" || props.token===undefined || props.token===null) {
      // o logout?
      console.log("Not logged in")
      window.location.href = "/login"
    } else {
      handleGetEvents()
    }
  }, [props])

  if(!props.token || props.token==="" || props.token===undefined || props.token===null) {
    // o logout?
    console.log("Not logged in")
    window.location.href = "/login"
  } else {
    return (
      <Container>
        {eventsLoading ? (
          <LoadingText>Cargando eventos...</LoadingText>
        ) : (
          <EventsContainer>
            {
              events.length > 0 ?
              events.map((event) => (
                <Event key={event.id} event={event} props={props} />
              )) :
              <span>No hay eventos para mostrar</span>
            }
          </EventsContainer>
        )}
      </Container>
    );
  }
};

export default Events;
