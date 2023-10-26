
import 'bootstrap/dist/css/bootstrap.min.css';
import Queue from './Queue';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GetTicket from './screens/GetTicket';
import ServeNextClient from "./screens/ServeNextClient.jsx";
import { useEffect, useState } from 'react';

function App() {

  const [queue, setQueue] = useState({})

  useEffect(()=>{
    console.log(queue)
  }, [queue])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/queue" element={<Queue queue={queue} />}></Route>
        <Route path="/getTicket" element={<GetTicket queue={queue} setQueue={setQueue} />}></Route>
        <Route path="/serveClient" element={<ServeNextClient/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
