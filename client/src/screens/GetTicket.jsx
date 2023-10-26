import React, { useEffect, useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import '../style/getTicket.css'
import DataAPI from '../FunctionalAPI/DataAPI'

function GetTicket(props) {

  const { setQueue } = props;

  const [hoveredService, setHoveredService] = useState(null)
  const [selectedService, setSelectedService] = useState(null)
  const [servicesName, setServicesName] = useState([]);

  useEffect(() => {
    DataAPI.GetServicesName()
      .then(names => {
        setServicesName(names);
      })
      .catch(e => {
        console.log(e);
      });
  }, []);

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
        {
          servicesName.map((service) => {
            return (
              <Col xs={4}
                className='mb-4'
                onMouseEnter={() => { setHoveredService(service.servicename) }}
                onMouseLeave={() => { setHoveredService(null) }}
                onClick={() => { selectedService !== service.servicename ? setSelectedService(service.servicename) : setSelectedService(null) }}>
                <div className={`serviceContainer ${hoveredService === service.servicename ? 'hovered' : ''} ${selectedService === service.servicename ? 'selected' : ''}`}>
                  <h2>{service.servicename}</h2>
                </div>
              </Col>
            )
          })
        }
      </Row>
      <div className='buttonsContainer'>
        <Button variant='outline-primary' className='me-3' onClick={() => setSelectedService(null)}>Cancel</Button>
        <Button variant='primary'>Continue</Button>
      </div>
    </Container>
  )
}

export default GetTicket
