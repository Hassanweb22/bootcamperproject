import React, { useState, useEffect } from 'react'
import { Card, Row, Col, Button } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import firebase from '../Components/firebase/index'

export default function Dashboard() {
    let history = useHistory()
    let  [admin, setAdmin] = useState({})

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (!!user) {
                firebase.database().ref("clients/").child(user.uid).on("value", snapshot => {
                    setAdmin(snapshot.val())
                    console.log("dashboardadmin", admin)
                })
            } else {
                // console.log("No user Found", user?.uid)
            }
        });
        return () => console.log("AdminDashboard has removed")
    }, [])

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
                            >Welcome Dear ! {admin?.username}</Card.Title>
                            < Row className="mt-3">
                                <Col className="text-center">
                                    <Button className=" rounded-5 px-4 py-2 mb-0 mb-2 mb-md-0 mb-lg-0" variant="success"
                                        onClick={() => history.push("./allusers")}>All Users</Button>

                                    <Button className="rounded-5 mx-3 px-4 py-2" variant="success"
                                        onClick={() => history.push("./allbookings")}>All Bookings</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </div >
            </div >
        </div >
    )
}
