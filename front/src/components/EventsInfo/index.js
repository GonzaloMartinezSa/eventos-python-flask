import { Container } from "./styles"
import { useState, useEffect } from "react";


const EventDetail = (props) => {
  const [info, setInfo] = useState("");

  const handleGetEventsInfo = async () => {
    //setEventsLoading(true)

    try {
      const response = await fetch(`http://localhost:5000/events-info`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + props.token
        },
      });
      const data = await response.json();
      console.log(data); // logs response
      if(response.status === 200) {
        data.access_token && props.setToken(data.access_token)
        setInfo(data)
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
      <Container>
        <h1> En las ultimas 2 horas: </h1>
        <h2>Votos: {info.votes}</h2>
        <h2>Eventos: {info.events}</h2>
      </Container>
    )
  }
}
export default EventDetail
