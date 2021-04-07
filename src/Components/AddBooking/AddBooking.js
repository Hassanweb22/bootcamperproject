import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Row, Container } from "react-bootstrap"
// import { X } from "react-bootstrap-icons"
// import { useHistory } from 'react-router-dom'
import firebase from "../firebase/index.js"
import ShowBookings from './ShowBookings.js'
// import "./style.css"/


export default function SignUp() {
    let initialState = {
        username: "",
        location: "",
        userDate: "",
        startTime: "",
        endTime: ""
    }

    const [state, setState] = useState(initialState)
    const [error, setError] = useState("")
    let { username, location, userDate, startTime, endTime } = state

    useEffect(() => {
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
        console.log("state", state)
        // console.log("Signupuser", user.uid)
        let no = Math.floor(Math.random() * 10 - 3 + 21);

        firebase.database().ref('users/').child(no).set(
            state,
            err => {
                if (err) {
                    console.log("error", err)
                }
            });
        setState(initialState)
        // history.push("./dashboard")
    }

    let validate = () => (username && location && startTime && endTime) ? true : false


    return (

        <div className="container mt-5">
            <h2 className="text-center text-capitalize main_heading mt-3">Parking Booking</h2>
            <div className="row show">
                <Card className="card_body col-lg-8 col-sm-12 col-md-10 col-11 mx-auto " style={{ width: '40rem' }}>

                    < Form className="my-3" onSubmit={handleSubmit}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter Username"
                                name="username"
                                value={username}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>Select Location</Form.Label>
                            <Form.Control as="select" name="location" value={location} onChange={handleChange}>
                                <option value="" className="font-weight-bold">Select Location</option>
                                <option value="tower">Tower</option>
                                <option value="malir">Malir</option>
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
                                <Form.Control type="time" name="endTime" value={endTime}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Row>

                        <Button className="w-100" variant="primary" type="submit" disabled={!validate()}>Submit</Button>
                    </Form>
                </Card>
            </div>
        </div >
    )
}
