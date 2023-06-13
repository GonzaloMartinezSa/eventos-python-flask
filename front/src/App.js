import Header from "./components/Header/index";
import { Container } from "./styles";
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EventDetail from './components/EventDetail/index';
import CreateForm from './components/CreateForm/index';
import Events from './components/EventsComponent/index';
import EventsInfo from './components/EventsInfo/index';
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout/index";
import NotFound from "./components/NotFound/index"

import useToken from './components/Token/useToken'

function App() {

  const { token, removeToken, setToken } = useToken();

  return (
    <Container>
      <Header />
      
      <BrowserRouter>
        {/* {!token && token!=="" && token!== undefined && token!=null} */}
        <Routes>
          {/* TODO: Cambiar el index para que pueda mandarte a las otras pantallas */}
          <Route index element={<Events token={token} setToken={setToken}/>} />
          <Route path="/register" element={<Register setToken={setToken}/>} />
          <Route path="/login" element={<Login setToken={setToken} />} />
          <Route path="/logout" element={<Logout token={token} removeToken={removeToken}/>} />
          <Route path="/events" element={<Events token={token} setToken={setToken}/>} />
          <Route path="/events/create" element={<CreateForm token={token} setToken={setToken}/>} />
          <Route path="/events/:id" element={<EventDetail token={token} setToken={setToken} />} />
          <Route path="/events-info" element={<EventsInfo token={token} setToken={setToken}/>} />
          {/* Esta tiene que ser la ultima ruta si o si */}
          <Route path="*" element={<NotFound/>} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
