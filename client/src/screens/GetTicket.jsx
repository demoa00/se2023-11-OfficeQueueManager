import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import '../style/getTicket.css'
import { getTicket } from '../API'

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
          onMouseEnter={()=>{setHoveredService('Assistance')}} 
          onMouseLeave={()=>{setHoveredService(null)}} 
          onClick={()=>{selectedService !== 'Assistance' ? setSelectedService('Assistance') : setSelectedService(null)}}>
            <div className={`serviceContainer ${hoveredService === 'Assistance' ? 'hovered' : ''} ${selectedService === 'Assistance' ? 'selected' : ''}`}>
              <h2>Assistance</h2>
            </div>
        </Col>
        <Col xs={4} 
          className='mb-4'
          onMouseEnter={()=>{setHoveredService('Expeditions')}} 
          onMouseLeave={()=>{setHoveredService(null)}}
          onClick={()=>{selectedService !== 'Expeditions' ? setSelectedService('Expeditions') : setSelectedService(null)}}>
            <div className={`serviceContainer ${hoveredService === 'Expeditions' ? 'hovered' : ''} ${selectedService === 'Expeditions' ? 'selected' : ''}`}>
              <h2>Expeditions</h2>
            </div>
        </Col>
        <Col xs={4} 
          className='mb-4'
          onMouseEnter={()=>{setHoveredService('Energy Services')}} 
          onMouseLeave={()=>{setHoveredService(null)}}
          onClick={()=>{selectedService !== 'Energy Services' ? setSelectedService('Energy Services') : setSelectedService(null)}}>
            <div className={`serviceContainer ${hoveredService === 'Energy Services' ? 'hovered' : ''} ${selectedService === 'Energy Services' ? 'selected' : ''}`}>
              <h2>Energy<br></br>Services</h2>
            </div>
        </Col>
        <Col xs={4} 
          className='mb-4'
          onMouseEnter={()=>{setHoveredService('Telephone Services')}} 
          onMouseLeave={()=>{setHoveredService(null)}}
          onClick={()=>{selectedService !== 'Telephone Services' ? setSelectedService('Telephone Services') : setSelectedService(null)}}>
            <div className={`serviceContainer ${hoveredService === 'Telephone Services' ? 'hovered' : ''} ${selectedService === 'Telephone Services' ? 'selected' : ''}`}>
              <h2>Telephone<br></br>Services</h2>
            </div>
        </Col>
        <Col xs={4} 
          className='mb-4'
          onMouseEnter={()=>{setHoveredService('Investments')}} 
          onMouseLeave={()=>{setHoveredService(null)}}
          onClick={()=>{selectedService !== 'Investments' ? setSelectedService('Investments') : setSelectedService(null)}}>
            <div className={`serviceContainer ${hoveredService === 'Investments' ? 'hovered' : ''} ${selectedService === 'Investments' ? 'selected' : ''}`}>
              <h2>Investments</h2>
            </div>
        </Col>
        <Col xs={4} 
          className='mb-4'
          onMouseEnter={()=>{setHoveredService('F')}} 
          onMouseLeave={()=>{setHoveredService(null)}}
          onClick={()=>{selectedService !== 'Insurance' ? setSelectedService('Insurance') : setSelectedService(null)}}>
            <div className={`serviceContainer ${hoveredService === 'Insurance' ? 'hovered' : ''} ${selectedService === 'Insurance' ? 'selected' : ''}`}>
              <h2>Insurance</h2>
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
