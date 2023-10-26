import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Col, Button, ListGroup, ListGroupItem, Container, Row, Spinner } from "react-bootstrap";

// COLOR PALETTE
// https://colorhunt.co/palette/00a9ff89cff3a0e9ffcdf5fd

const rowStyle = {
    border: "1px solid #00A9FF",
    borderRadius: "8px",
    marginBottom: "5px"
};

const h3Style = {
    textAlign: "center",
};

function Queue(props) {

    const { queue } = props;

    const [queue1, setQueue1] = useState([{ id_ticket: 1, client: "mario", insertTime: dayjs(), inProcess: false },
    { id_ticket: 2, client: "maria", insertTime: dayjs(), inProcess: false },
    { id_ticket: 3, client: "lucia", insertTime: dayjs(), inProcess: false },
    { id_ticket: 4, client: "luigi", insertTime: dayjs(), inProcess: false },
    { id_ticket: 5, client: "andrea", insertTime: dayjs(), inProcess: false }]);

    let service = "SPID";

    useEffect(() => {
        /* WAIT FOR API */
    },
        [queue1]
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
        <Container className="d-flex flex-column justify-content-center" fluid>
            <Row className="d-flex justify-content-center" style={{ ...rowStyle, margin: "5px", backgroundColor: "#89CFF3" }}>
                <h3 style={h3Style}>{"Waiting list for " + service}</h3>
            </Row>
            <Row>
                <Col style={{ margin: "20px" }}>
                    {
                        queue1.sort((a, b) => a.insertTime.diff(b.insertTime)).map((q, i) => {
                            if (q.inProcess) {
                                return <Row key={i} className="d-flex justify-content-between align-items-center" style={{ ...rowStyle, backgroundColor: "#A0E9FF" }}>
                                    <Col className="d-flex justify-content-start"><h3 style={h3Style}>{q.id_ticket + " " + q.client}</h3></Col>
                                    <Col className="d-flex justify-content-center"><h3 style={h3Style}>{"Desk " + q.desk_number}</h3></Col>
                                </Row>;
                            }
                            return <Row key={i} className="d-flex justify-content-between align-items-center" style={rowStyle}>
                                <Col className="d-flex justify-content-start"><h3 style={h3Style}>{q.id_ticket + " " + q.client}</h3></Col>
                                <Col className="d-flex justify-content-center"><h3 style={h3Style}>{"Waiting"}</h3></Col>
                                <Col className="d-flex justify-content-end"><Spinner variant="dark" size="sm" animation="border" /></Col>
                            </Row>;
                        })
                    }
                </Col>
            </Row>
        </Container>
        <Col className="d-flex flex-row justify-content-center">
            <Button onClick={() => nextTicket(3)}>
                next client
            </Button>
            <Button onClick={() => addTicket({ id_ticket: queue1.length + 1, client: "francesca", insertTime: dayjs() })}>
                add client
            </Button>
            <Button onClick={() => deleteTicket(3)}>
                delete client
            </Button>
        </Col>
    </>;
}

export default Queue;