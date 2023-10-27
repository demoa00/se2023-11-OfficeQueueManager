import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Modal, Row } from 'react-bootstrap'
import DataAPI from '../FunctionalAPI/DataAPI'
import '../style/getTicket.css'
import { useNavigate } from 'react-router-dom'

function GetTicket(props) {

  const [services, setServices] = useState(null)
  const [hoveredService, setHoveredService] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [ticket, setTicket] = useState(null)

  const navigate = useNavigate()

  useEffect(() => {
    DataAPI.GetServicesName().then((s) => {
      setServices(s)
    }).catch((err) => {
      console.log(err)
    })
  }, [])

  function getTicket() {
    DataAPI.NewTicket(selectedService.servicename).then((ticket) => {
      setTicket(ticket)
      setShowModal(true)
      setTimeout(() => {
        setShowModal(false)
      }, 5000)
    }).catch((err) => {
      console.log(err)
    })
  }

  return (
    <Container className='vh-100'>
      <Row className='mb-5'>
        <Col xs={12} className='text-center'>
          <h1 >
            Select your service
          </h1>
        </Col>
      </Row>
      <Row>
        {
          services && services.map((service, index) => {
            return (
              <Col xs={4}
                key={index}
                className='mb-4'
                onMouseEnter={() => { setHoveredService(service) }}
                onMouseLeave={() => { setHoveredService(null) }}
                onClick={() => { selectedService !== service ? setSelectedService(service) : setSelectedService(null) }}>
                <div className={`serviceContainer ${hoveredService === service ? 'hovered' : ''} ${selectedService === service ? 'selected' : ''}`}>
                  <h2>{service.servicename}</h2>
                </div>
              </Col>
            )
          })
        }
      </Row>
      <div className='buttonsContainer'>
        <Button variant='outline-danger' className='me-3' onClick={() => setSelectedService(null)}>Cancel</Button>
        <Button variant='success' disabled={!!!selectedService} onClick={getTicket}>Continue</Button>
      </div>
      <Modal
        show={showModal}
        centered>
        <Modal.Body className='text-center'>
          <h2>Your ticket is number:</h2>
          <h1 style={{ "fontSize": "64px" }}>{!!ticket ? ticket.number : ''}</h1>
        </Modal.Body>
      </Modal>
    </Container>
  )
}

export default GetTicket