import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Spinner } from "react-bootstrap"
import { ArrowLeftCircleFill, ArrowRightCircleFill, ArrowBarRight } from "react-bootstrap-icons"
import { useHistory } from "react-router-dom"
import firebase from "../firebase/index"
import "./style.css"

function Locations() {
    const history = useHistory()
    const [currentUser, setCurrentUser] = useState({})
    const [allLocations, setAllLocations] = useState({})

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user !== null && user?.email !== "admin@gmail.com") {
                setCurrentUser(user)
            }
        });
        firebase.database().ref("admin").child("locations").on("value", snapshot => {
            setAllLocations(snapshot.val())
        })
    }, [])
    return (
        !!Object.keys(currentUser).length ?
            <>
                <div className="container mt-4">
                    <div className="users_heading">
                        <h2 className="text-center text-capitalize" >
                            <ArrowLeftCircleFill onClick={() => history.goBack()} style={{ fontWeight: "bold", cursor: "pointer" }} />
                   &nbsp;Locations&nbsp;
                    <ArrowRightCircleFill onClick={() => history.goForward()} style={{ fontWeight: "bold", cursor: "pointer" }} />
                        </h2>
                    </div>
                    {Object.keys(allLocations).length > 0 ?
                        <Card>
                            <Card.Body >
                                <p className="text-center text-dark">Select one of the following Locations for Parking</p>
                                <ListGroup variant="flush">
                                    {Object.keys(allLocations).map(key => {
                                        return <ListGroup.Item key={key}>
                                            <span>{allLocations[key].locationName}<br /></span>
                                            <ArrowBarRight onClick={_ => history.push(`/locations/${allLocations[key].locationName}/${allLocations[key].slots}`)} />
                                        </ListGroup.Item>
                                    })}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                        :
                        <div className="text-center mx-auto">
                            <Spinner animation="border" size="lg" variant="primary" />
                        </div>}
                </div>
            </> : null
    )
}

export default Locations
