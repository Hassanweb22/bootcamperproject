import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Row, Container } from "react-bootstrap"
// import { X } from "react-bootstrap-icons"
// import { useHistory } from 'react-router-dom'
import firebase from "../firebase/index.js"
import "../style.css"


export default function SignUp() {
    let initialState = {
        username: "",
        location: "",
        userDate: "",
        startTime: "",
        endTime: ""
    }

    const [state, setState] = useState(initialState)
    const [currentUser, setcurrentUser] = useState({})
    let { username, location, userDate, startTime, endTime } = state

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                firebase.database().ref("clients/").child(user.uid).on("value", snapshot => {
                    console.log("AddBooking userData FireBase", snapshot.val())
                    setcurrentUser(snapshot.val())
                })
            } else {
                console.log("No user Found", user?.uid)
            }
        });
        return () => console.log("AddBooking unmounted")
    }, [])

    const handleChange = (e) => {
        let { name, value } = e.target
        setState({
            ...state,
            [name]: value,
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log("state", state)

        console.log({ currentUser })
        const { uid } = firebase.auth().currentUser
        const key = firebase.database().ref("clients").child(uid).child("/bookings").push().key
        let bookingObj = { bookingId: key, location, userDate, startTime, endTime }
        let adminBookingObj = { bookingId: key, uid, location, userDate, startTime, endTime }
        console.log("bookingObj", bookingObj)
        firebase.database().ref('clients/').child(uid).child(`/bookings/${key}`).set(
            bookingObj,
            err => {
                if (err) {
                    console.log("error", err)
                }
            });
        firebase.database().ref('admin/').child(`/bookings/${key}`).set(
            adminBookingObj,
            err => {
                if (err) {
                    console.log("error", err)
                }
            });
        console.log("adminBookingObj", adminBookingObj)
        setState(initialState)
    }

    let validate = () => (location && startTime && endTime !=="None") ? true : false


    return (

        <div className="container mt-5">
            <div className="users_heading">
                <h2 className="text-center text-capitalize">Parking Booking</h2>
            </div>
            <div className="row show">
                <Card className="card_body col-lg-8 col-sm-12 col-md-10 col-11 mx-auto " style={{ width: '40rem' }}>

                    < Form className="my-3" onSubmit={handleSubmit}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter Username"
                                name="username"
                                disabled
                                value={String(currentUser.username).toUpperCase()}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Select Location</Form.Label>
                            <Form.Control as="select" name="location" value={location} onChange={handleChange}>
                                <option value="" className="font-weight-bold">Select Location</option>
                                <option value="tower">Tower</option>
                                <option value="malir">Malir</option>
                                <option value="nagan churangi">Nagan Churangi</option>
                                <option value="nazimabad">Nazimabad</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="exampleForm.dateTime">
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" name="userDate" value={userDate}
                                onChange={handleChange}
                            />

                        </Form.Group>
                        <Row>
                            <Form.Group className="col-md-6 col-12" controlId="exampleForm.dateTime">
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control type="time" name="startTime" value={startTime}
                                    onChange={handleChange}
                                />

                            </Form.Group>
                            <Form.Group className="col-md-6 " controlId="exampleForm.dateTime">
                                <Form.Label>End Time</Form.Label> 
                                <Form.Control as="select" name="endTime" value={endTime} onChange={handleChange}>
                                    <option value="None" className="font-weight-bold">None</option>
                                    <option value="tower">Tower</option>
                                    <option value="malir">Malir</option>
                                    <option value="nagan churangi">Nagan Churangi</option>
                                    <option value="nazimabad">Nazimabad</option>
                                </Form.Control>
                            </Form.Group>
                        </Row>

                        <Button className="w-100" variant="primary" type="submit" disabled={!validate()}>Submit</Button>
                    </Form>
                </Card>
            </div>
        </div >
    )
}
