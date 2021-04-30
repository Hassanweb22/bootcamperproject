import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Button, Spinner } from "react-bootstrap"
import { useHistory, withRouter } from "react-router-dom"
import firebase from '../Components/firebase/index'

function Dashboard() {
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
                setcurrentUser({})
            }
        });
        return () => console.log("Dashboard Unmounted")
    }, [firebase.auth().currentUser])
    return (
        <div>
            <div className="container">
                <div className="users_heading">
                    <h2 className="text-center text-capitalize">Dashboard</h2>
                </div>
                {Object.keys(currentUser).length > 0 ?
                    <div className="row">
                        <Card className="card_body col-lg-8 col-sm-9 col-md-10 col-11 mx-auto mt-4" style={{ width: '40rem' }}>
                            {/* <Card.Img variant="top" src="holder.js/100px180" /> */}
                            <Card.Body>
                                <Card.Title className="text-center text-capitalize font-italic text-info"
                                    style={{ fontSize: 25 }}
                                >Welcome Dear ! {currentUser ? currentUser?.username : "User"}</Card.Title>
                                < Row className="mt-3">
                                    <Col className="text-center">
                                        <Button className="rounded-5 px-4 py-2 mb-0 mb-2 mb-md-0 mb-lg-0" variant="success"
                                            onClick={() => history.push("/locations")}>Show Locations</Button>

                                        <Button className="rounded-5 mx-3 px-4 py-2" variant="success"
                                            onClick={() => history.push("/showBookings")}>Show Bookings</Button>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </div >
                    : <div className="text-center mt-5">
                        <Spinner size="lg" animation="border" variant="info" />
                    </div>
                }
            </div >
        </div >
    )
}

export default withRouter(Dashboard);
