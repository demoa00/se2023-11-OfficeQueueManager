import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Col, Button, ListGroup, ListGroupItem, Container, Row, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

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
    const [queue, setQueue] = useState([{ id_ticket: 1, client: "mario", insertTime: dayjs(), inProcess: false },
    { id_ticket: 2, client: "maria", insertTime: dayjs(), inProcess: false },
    { id_ticket: 3, client: "lucia", insertTime: dayjs(), inProcess: false },
    { id_ticket: 4, client: "luigi", insertTime: dayjs(), inProcess: false },
    { id_ticket: 5, client: "andrea", insertTime: dayjs(), inProcess: false }]);

    const navigate = useNavigate();

    let service = "SPID";

    useEffect(() => {
        /* WAIT FOR API */
    },
        [queue]
    );

    const nextTicket = (desk_number) => {
        setQueue((oldQueue) => {
            let next = oldQueue.filter((q) => !q.inProcess).sort((a, b) => a.insertTime.diff(b.insertTime)).find((q) => !q.inProcess);

            if (next != undefined) {
                return oldQueue.map((q) => {
                    if (q.id_ticket == next.id_ticket) {
                        return { ...q, inProcess: true, desk_number: desk_number };
                    } else {
                        return { ...q };
                    }
                });
            } else {
                return oldQueue;
            }

        })
    };

    const deleteTicket = (desk_number) => {
        setQueue((oldQueue) => {
            let deleted = oldQueue.find((q) => q.desk_number == desk_number);

            if (deleted != undefined) {
                return oldQueue.filter((q) => q.id_ticket != deleted.id_ticket);
            } else {
                return oldQueue;
            }
        })
    };

    const addTicket = (new_client) => {
        setQueue((oldQueue) => {
            return [...oldQueue, new_client].sort((a, b) => a.insertTime.diff(b.insertTime));
        })
    };

    return <>
        <Container className="d-flex flex-column">
            <Row className="d-flex justify-content-center" style={{ ...rowStyle, margin: "5px", backgroundColor: "#89CFF3" }}>
                <h3 style={h3Style}>{"Waiting list for " + service}</h3>
            </Row>
            <Container fluid className="d-flex flex-column justify-content-between h-100">
                <Row>
                    <Col style={{ margin: "20px 0" }} className="text-start" xs={12}>
                        {
                            Object.entries(props.queue).map(([service, queue]) => {
                                return(
                                    <div className="mb-4">
                                        <h3 className="font-weight-bold">{service}</h3>
                                        {
                                            queue.map((number) => {
                                                return (    
                                                    <Row key={number} className="d-flex justify-content-between align-items-center" style={rowStyle}>
                                                        <Col className="d-flex justify-content-start"><h3 style={h3Style}>{number}</h3></Col>
                                                        <Col className="d-flex justify-content-center"><h3 style={h3Style}>{"Waiting"}</h3></Col>
                                                        <Col className="d-flex justify-content-end"><Spinner variant="dark" size="sm" animation="border" /></Col>
                                                    </Row>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                            // props.queue.sort((a, b) => a.insertTime.diff(b.insertTime)).map((q, i) => {
                            //     if (q.inProcess) {
                            //         return <Row key={i} className="d-flex justify-content-between align-items-center" style={{ ...rowStyle, backgroundColor: "#A0E9FF" }}>
                            //             <Col className="d-flex justify-content-start"><h3 style={h3Style}>{q.id_ticket + " " + q.client}</h3></Col>
                            //             <Col className="d-flex justify-content-center"><h3 style={h3Style}>{"Desk " + q.desk_number}</h3></Col>
                            //         </Row>;
                            //     }
                            //     return <Row key={i} className="d-flex justify-content-between align-items-center" style={rowStyle}>
                            //         <Col className="d-flex justify-content-start"><h3 style={h3Style}>{q.id_ticket + " " + q.client}</h3></Col>
                            //         <Col className="d-flex justify-content-center"><h3 style={h3Style}>{"Waiting"}</h3></Col>
                            //         <Col className="d-flex justify-content-end"><Spinner variant="dark" size="sm" animation="border" /></Col>
                            //     </Row>;
                            // })
                        }
                    </Col>
                </Row>
                <Row>
                    <Col className="d-flex flex-row justify-content-center" xs={12}>
                        {/* <Button onClick={() => nextTicket(3)}>
                            next client
                        </Button>
                        <Button onClick={() => addTicket({ id_ticket: queue.length + 1, client: "francesca", insertTime: dayjs() })}>
                            add client
                        </Button>
                        <Button onClick={() => deleteTicket(3)}>
                            delete client
                        </Button> */}
                        <Button onClick={() => navigate('/getTicket')}>Get Ticket</Button>
                    </Col>
                </Row>

            </Container>
        </Container>
    </>;
}

export default Queue;