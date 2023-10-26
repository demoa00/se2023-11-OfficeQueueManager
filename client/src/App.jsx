
import 'bootstrap/dist/css/bootstrap.min.css';
import Queue from './Queue';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GetTicket from './screens/GetTicket';
import ServeNextClient from "./screens/ServeNextClient.jsx";
import { React, useState, useEffect } from 'react';

function App() {
  const [queue, setQueue] = useState([]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/queue" element={<Queue queue={queue} />}></Route>
        <Route path="/getTicket" element={<GetTicket setQueue={setQueue} />}></Route>
        <Route path="/serveClient" element={<ServeNextClient setQueue={setQueue} />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
