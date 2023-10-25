
import 'bootstrap/dist/css/bootstrap.min.css';
import Queue from './Queue';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GetTicket from './screens/GetTicket';
import ServeNextClient from "./screens/ServeNextClient.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/queue" element={<Queue/>}></Route>
        <Route path="/getTicket" element={<GetTicket/>}></Route>
          <Route path="/serveClient" element={<ServeNextClient/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
