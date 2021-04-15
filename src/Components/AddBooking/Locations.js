import React from 'react';
import { Card, ListGroup } from "react-bootstrap"
import { ArrowLeftCircleFill, ArrowRightCircleFill, ArrowBarRight } from "react-bootstrap-icons"
import { useHistory } from "react-router-dom"
import "./style.css"

function Locations() {
    const history = useHistory()
    return (
        <div className="container mt-4">
            <div className="users_heading">
                <h2 className="text-center text-capitalize" >
                    <ArrowLeftCircleFill onClick={() => history.goBack()} style={{ fontWeight: "bold", cursor: "pointer" }} />
                   &nbsp;Locations&nbsp;
                    <ArrowRightCircleFill onClick={() => history.goForward()} style={{ fontWeight: "bold", cursor: "pointer" }} />
                </h2>
            </div>
            <Card>
                <Card.Body >
                    <p className="text-center text-dark">Select one of the following Locations for Parking</p>
                    <ListGroup variant="flush">
                        <ListGroup.Item><span>Malir</span><ArrowBarRight onClick={_ => history.push("/locations/malir")} /></ListGroup.Item>
                        <ListGroup.Item><span>Bhadurabad</span> <ArrowBarRight onClick={_ => history.push("/locations/bhadurabad")} /></ListGroup.Item>
                        <ListGroup.Item><span>Tower</span> <ArrowBarRight onClick={_ => history.push("/locations/tower")} /></ListGroup.Item>
                    </ListGroup>
                </Card.Body>
            </Card>
        </div>
    )
}

export default Locations
