import React from 'react';
import { Card, ListGroup } from "react-bootstrap"
import { BoxArrowRight } from "react-bootstrap-icons"
import { useHistory } from "react-router-dom"
import "./style.css"

function Locations() {
    const history = useHistory()
    return (
        <div className="container mt-4">
            <div className="users_heading">
                <h2 className="text-center text-capitalize" >Locations</h2>
            </div>
            <Card>
                <Card.Body >
                    <p className="text-center text-dark">Select one of the following Locations for Parking</p>
                    <ListGroup variant="flush">
                        <ListGroup.Item><span>Malir</span><BoxArrowRight onClick={_ => history.push("/locations/malir")} /></ListGroup.Item>
                        <ListGroup.Item><span>Bhadurabad</span> <BoxArrowRight onClick={_ => history.push("/locations/bhadurabad")} /></ListGroup.Item>
                        <ListGroup.Item><span>Tower</span> <BoxArrowRight onClick={_ => history.push("/locations/tower")} /></ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Locations
