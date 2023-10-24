import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import '../style/getTicket.css'

function GetTicket() {

  const [hoveredService, setHoveredService] = useState(null)
  const [selectedService, setSelectedService] = useState(null)

  useEffect(()=>{
    console.log("selectedService", selectedService)    
  }, [selectedService])

  return (
    <Container className='p-4 vh-100 d-flex flex-column'>
      <Row className='mb-5'>
        <Col xs={12} className='text-center'>
          <h1 >
            Select your service
          </h1>
        </Col>
      </Row>
      <Row>
        <Col xs={4} 
          className='mb-4'
          onMouseEnter={()=>{setHoveredService('A')}} 
          onMouseLeave={()=>{setHoveredService(null)}} 
          onClick={()=>{selectedService !== 'A' ? setSelectedService('A') : setSelectedService(null)}}>
            <div className={`serviceContainer ${hoveredService === 'A' ? 'hovered' : ''} ${selectedService === 'A' ? 'selected' : ''}`}>
              <h2>Service <br></br>A</h2>
            </div>
        </Col>
        <Col xs={4} 
          className='mb-4'
          onMouseEnter={()=>{setHoveredService('B')}} 
          onMouseLeave={()=>{setHoveredService(null)}}
          onClick={()=>{selectedService !== 'B' ? setSelectedService('B') : setSelectedService(null)}}>
            <div className={`serviceContainer ${hoveredService === 'B' ? 'hovered' : ''} ${selectedService === 'B' ? 'selected' : ''}`}>
              <h2>Service <br></br>B</h2>
            </div>
        </Col>
        <Col xs={4} 
          className='mb-4'
          onMouseEnter={()=>{setHoveredService('C')}} 
          onMouseLeave={()=>{setHoveredService(null)}}
          onClick={()=>{selectedService !== 'C' ? setSelectedService('C') : setSelectedService(null)}}>
            <div className={`serviceContainer ${hoveredService === 'C' ? 'hovered' : ''} ${selectedService === 'C' ? 'selected' : ''}`}>
              <h2>Service <br></br>C</h2>
            </div>
        </Col>
        <Col xs={4} 
          className='mb-4'
          onMouseEnter={()=>{setHoveredService('D')}} 
          onMouseLeave={()=>{setHoveredService(null)}}
          onClick={()=>{selectedService !== 'D' ? setSelectedService('D') : setSelectedService(null)}}>
            <div className={`serviceContainer ${hoveredService === 'D' ? 'hovered' : ''} ${selectedService === 'D' ? 'selected' : ''}`}>
              <h2>Service <br></br>D</h2>
            </div>
        </Col>
        <Col xs={4} 
          className='mb-4'
          onMouseEnter={()=>{setHoveredService('E')}} 
          onMouseLeave={()=>{setHoveredService(null)}}
          onClick={()=>{selectedService !== 'E' ? setSelectedService('E') : setSelectedService(null)}}>
            <div className={`serviceContainer ${hoveredService === 'E' ? 'hovered' : ''} ${selectedService === 'E' ? 'selected' : ''}`}>
              <h2>Service <br></br>E</h2>
            </div>
        </Col>
        <Col xs={4} 
          className='mb-4'
          onMouseEnter={()=>{setHoveredService('F')}} 
          onMouseLeave={()=>{setHoveredService(null)}}
          onClick={()=>{selectedService !== 'F' ? setSelectedService('F') : setSelectedService(null)}}>
            <div className={`serviceContainer ${hoveredService === 'F' ? 'hovered' : ''} ${selectedService === 'F' ? 'selected' : ''}`}>
              <h2>Service <br></br>F</h2>
            </div>
        </Col>
      </Row>
      <div className='buttonsContainer'>
        <Button variant='outline-primary' className='me-3' onClick={()=>setSelectedService(null)}>Annulla</Button>
        <Button variant='primary'>Prosegui</Button>
      </div>
    </Container>
  )
}

export default GetTicket