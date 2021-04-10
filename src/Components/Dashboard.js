import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Button } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import firebase from '../Components/firebase/index'

export default function Dashboard() {
    let history = useHistory()
    const [currentUser, setcurrentUser] = useState({})

    useEffect(() => {
        // setcurrentUser(firebase.auth().currentUser)
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                firebase.database().ref("clients/").child(user.uid).on("value", snapshot => {
                    setcurrentUser(snapshot.val())
                })
            } else {
                console.log("No user Found", user?.uid)
            }
        });
        return () => console.log("Dashboard Unmounted")
    }, [firebase.auth().currentUser])
    console.log("dashboardUser", currentUser)
    return (
        <div>
            <div className="container">
                <div className="users_heading">
                    <h2 className="text-center text-capitalize">Dashboard</h2>
                </div>
                <div className="row">
                    <Card className="card_body col-lg-8 col-sm-9 col-md-10 col-11 mx-auto mt-4" style={{ width: '40rem' }}>
                        {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                        <Card.Body>
                            <Card.Title className="text-center text-capitalize font-italic text-info"
                                style={{ fontSize: 25 }}
                            >Welcome Dear ! {currentUser ? currentUser?.username : "User"}</Card.Title>
                            <Row>
                                {/* {!fire.auth().currentUser?.uid ? */}
                                {/* <Card.Text className="text-center mx-auto font-weight-bold">You can Add New Bookings </Card.Text>
                                <Card.Text className="text-center mx-auto font-weight-bold">You can Check Your Bookings <br /></Card.Text> */}
                                {/* } */}
                            </Row>
                            < Row className="mt-3">
                                <Col className="text-center">
                                    <Button className=" rounded-5 px-4 py-2" variant="success"
                                        onClick={() => history.push("/locations")}>Show Locations</Button>

                                    <Button className="rounded-5 mx-3 px-4 py-2" variant="success"
                                        onClick={() => history.push("/showBookings")}>Show Bookings</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </div >
            </div >
        </div >
    )
}
