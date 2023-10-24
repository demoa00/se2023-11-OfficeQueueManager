import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap'
import Queue from './Queue';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GetTicket from './screens/GetTicket';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/queue" element={<Queue/>}></Route>
        <Route path="/" element={<GetTicket/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
