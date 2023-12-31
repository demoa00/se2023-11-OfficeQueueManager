import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Col, Button, ListGroup, ListGroupItem, Container, Row, Spinner } from "react-bootstrap";
import { json, useNavigate } from "react-router-dom";
import DataAPI from "./FunctionalAPI/DataAPI";

// COLOR PALETTE
// https://colorhunt.co/palette/00a9ff89cff3a0e9ffcdf5fd

const rowStyle = {
    border: "1px solid #00A9FF",
    borderRadius: "8px",
    marginBottom: "5px"
};

const h3Style = {
    textAlign: "center",
    margin: "5px 0"
};

function Queue(props) {
    const [queue, setQueue] = useState([]);
    const [services, setServices] = useState([]);

    useEffect(() => {
        setInterval(() => {
            DataAPI.GetWaitingTickets()
                .then((tickets) => {
                    console.log(tickets)
                    setQueue(tickets)
                })
                .catch((err) => { console.log(err) });
            DataAPI.GetServicesName().then((services) => {
                setServices(services);
            }).catch((err) => { console.log(err) });
        }, 5000);
    })

    return <>
        <Container className="d-flex flex-column" fluid>
            <Container style={{ "height": "100vh", "overflow": "auto" }} fluid className="d-flex flex-column justify-content-between p-4">
                <Row style={{ "height": "100%", "overflow": "auto" }}>
                    {services.map((service, i) => {
                        return (
                            <Col xs={2} className="px-4 text-center">
                                <h3 style={{ height: '70px' }}>{service.servicename}</h3>
                                <div>
                                    {queue.filter(e => e.servicename == service.servicename).map((q, i) => {
                                        return (
                                            <Row key={i} className="d-flex justify-content-between align-items-center" style={rowStyle}>
                                                <Col className="d-flex justify-content-startr"><h4 style={h3Style}>{JSON.stringify(q.id)}</h4></Col>
                                                <Col className="d-flex justify-content-end"><Spinner variant="dark" size="sm" animation="border" /></Col>
                                            </Row>
                                        );
                                    })}
                                </div>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
        </Container>
    </>;
}

export default Queue;