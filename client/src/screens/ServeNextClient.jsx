import React, { useEffect, useState } from 'react'
import {Button, Col, Container, Row, Table} from 'react-bootstrap'
import '../style/serveNextClient.css'
import DataAPI from "../FunctionalAPI/DataAPI.jsx";

function ServeNextClient() {
    const [nuovoCliente, setNuovoCliente] = useState(null);
    const [servizioInCorso, setServizioInCorso] = useState(false);
    const [tempoFineServizio, setTempoFineServizio] = useState(null);
    const [tempoTrascorso, setTempoTrascorso] = useState(0);
    const [intervalloTempo, setIntervalloTempo] = useState(null);

    const servizi = ([{id:1, nome:"Assistance", averageServiceTime:"5"}, {id:2, nome:"Expeditions", averageServiceTime:"2"}])


    const chiamaNuovoCliente = async () => {
        setTimeout(async ()=>{

            setNuovoCliente({id:"1", serviceId:"1", service:"Assistance"})
            setServizioInCorso(true);
            const tempoInizioServizio = new Date()

            const intervalId = setInterval(() => {
                const tempoCorrente = new Date();

                const tempoTrascorso = tempoCorrente - tempoInizioServizio;
                setTempoTrascorso(tempoTrascorso);
            }, 1000); // Ogni secondo
            setIntervalloTempo(intervalId);

             /*
            try {
                // Chiamata all'API per ottenere i dati del nuovo cliente
                const response = await DataAPI.GetNextTicket(servizi[0].nome);
                if (!response.ok) {
                    throw new Error('Errore nella chiamata API');
                }

                const data = await response.json();

                // Imposta i dati del nuovo cliente nello stato
                setNuovoCliente(data)

                setServizioInCorso(true);
                setTempoInizioServizio(new Date());
                const intervalId = setInterval(() => {
                    const tempoCorrente = new Date();
                    const tempoTrascorso = tempoCorrente - tempoInizioServizio;
                    setTempoTrascorso(tempoTrascorso);
                }, 1000); // Ogni secondo

                // Imposta l'intervallo come stato per poterlo cancellare più tardi
                setIntervalloTempo(intervalId);
            } catch (error) {
                console.error(error);
                // Gestire gli errori in modo appropriato, ad esempio, mostrando un messaggio all'utente
            }

              */


        },5)

    };

    const terminaServizioCliente = async () => {
        setTimeout(()=>{
            setServizioInCorso(false);
            setTempoFineServizio(new Date());
            clearInterval(intervalloTempo);

            const tempoDiServizio =
                tempoInizioServizio && tempoFineServizio
                    ? tempoFineServizio - tempoInizioServizio
                    : null;

            if (tempoDiServizio !== null) {
                // Invia il tempoDiServizio al tuo sistema di gestione del database
                inviaTempoDiServizioAlDatabase(tempoDiServizio);
            }
        },5)

    };

    return (
        <Container className="my-5">
            <div className=" card">
                {servizioInCorso ? (
                    <Col xs={12}>
                        <Row className='mb-5'>
                            <h2>Serving Client</h2>
                        </Row>
                        <Row className='mb-5'>
                            <Col>
                                <p>Ticket Number: {JSON.parse(JSON.stringify(nuovoCliente)).id}</p>

                            </Col>
                            <Col>
                                <p>Service: {JSON.parse(JSON.stringify(nuovoCliente)).service}</p>

                            </Col>
                        </Row>
                        <Row className='mb-5'>
                            <div className="tempo-trascorso">
                                Tempo trascorso: {Math.floor(tempoTrascorso / 1000)} secondi
                            </div>
                        </Row>
                        <Row>
                            <Button variant="primary" onClick={terminaServizioCliente}>
                                End customer service
                            </Button>
                        </Row>
                    </Col>
                ) : (
                    <Col xs={12}>
                        <Row className='mb-5'>
                            <ServiziDaServire servizi = {servizi} />
                        </Row>
                        <Row>
                            <Button variant="primary" onClick={chiamaNuovoCliente}>
                                Chiama nuovo cliente
                            </Button>
                        </Row>
                    </Col>
                )}
            </div>
        </Container>
    );
}

function ServiziDaServire(props) {
   // const [servizi, setServizi] = useState([]);

    /*useEffect(() => {
        // Esegui la chiamata API per ottenere i servizi da servire
        fetch('URL_DEL_TUO_ENDPOINT_API')
            .then((response) => response.json())
            .then((data) => {
                setServizi(data);
            })
            .catch((error) => {
                console.error('Errore durante il recupero dei servizi:', error);
            });
    }, []);


    setServizi([{id:1, nome:"spid", averageServiceTime:"3"},{id:2, nome:"prelievo", averageServiceTime:"5"}])

     */


    return (
        <Col xs={12}>
            <Row>
                {props.servizi.length > 0 ? (
                    <div className="servizi-container">
                        <h2>Servizi da servire</h2>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Nome del Servizio</th>
                                <th>Tempo di Servizio Medio</th>
                            </tr>
                            </thead>
                            <tbody>
                            {props.servizi.map((servizio, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{JSON.parse(JSON.stringify(servizio)).nome}</td>
                                    <td>{JSON.parse(JSON.stringify(servizio)).averageServiceTime} min</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>)
                    : (
                        <div className="servizi-container"></div>
                    )
                }
            </Row>
        </Col>
    );
}
export default ServeNextClient;