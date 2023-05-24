import Header from "./components/Header/index";
import { Container } from "./styles";
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import EventDetail from './components/EventDetail/index';
import CreateForm from './components/CreateForm/index';
import Events from './components/EventsComponent/index';
import EventsInfo from './components/EventsInfo/index';
import EventOptions from './components/EventOptions/index';
import Register from "./components/Register";
import Login from "./components/Login";
import Logout from "./components/Logout/index";
import NotFound from "./components/NotFound/index"

import useToken from './components/Token/useToken'

function App() {

  const { token, removeToken, setToken } = useToken();

  // const location = useLocation();
  // const currentPath = location.pathname;

  return (
    <Container>
      <Header />
      
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
        </Routes>
        {!token && token!=="" &&token!== undefined ? 
          <Login setToken={setToken} />
          : (
            <Routes>
              {/* TODO: Cambiar el index para que pueda mandarte a las otras pantallas */}
              <Route index element={<Events token={token} setToken={setToken}/>} />
              {/* <Route path="/register" element={<Register />} /> */}
              {/* <Route path="/login" element={<Login />} /> */}
              <Route path="/logout" element={<Logout token={removeToken}/>} />
              <Route path="/events" element={<Events token={token} setToken={setToken}/>} />
              <Route path="/events/create" element={<CreateForm token={token} setToken={setToken}/>} />
              <Route path="/events/:id" element={<EventDetail token={token} setToken={setToken} />} />
              <Route path="/events-info" element={<EventsInfo token={token} setToken={setToken}/>} />
              {/* <Route path="/events/:id/options" element={<EventOptions />} /> */}
              {/* Esta tiene que ser la ultima ruta si o si */}
              <Route path="*" element={<NotFound/>} />
            </Routes>
        )}
      </BrowserRouter>
    </Container>
  );
}

export default App;
