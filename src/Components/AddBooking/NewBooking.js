import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Row, Container } from "react-bootstrap"
// import { X } from "react-bootstrap-icons"
import { useHistory, useParams } from 'react-router-dom'
import firebase from "../firebase/index.js"
import "../style.css"


export default function NewBookings() {
    const { address } = useParams()
    let initialState = {
        username: "",
        location: address,
        userDate: "",
        startTime: "",
        endTime: "",
        slots: ""
    }

    const [state, setState] = useState(initialState)
    const [currentUser, setcurrentUser] = useState({})
    let [noOfSlots, setNoOfSlots] = useState([])
    let { location, slots, userDate, startTime, endTime } = state

    useEffect(() => {
        console.log({ address })
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
        if (address === "malir") {
            setNoOfSlots(Array(7).fill(1).map((x, y) => x + y))
        }
        else if (address === "bhadurabad") {
            setNoOfSlots(Array(5).fill(1).map((x, y) => x + y))
        }
        else {
            setNoOfSlots(Array(3).fill(1).map((x, y) => x + y))
        }
        return () => console.log("newbOOKING unmounted")
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
        let bookingObj = { bookingId: key, location, slots, userDate, startTime, endTime }
        let adminBookingObj = { bookingId: key, uid, location, slots, userDate, startTime, endTime }
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

    let validate = () => (location && userDate && startTime && endTime && slots) ? true : false


    return (

        <div className="container my-5">
            <div className="users_heading">
                <h2 className="text-center text-capitalize">Parking Booking</h2>
            </div>
            <div className="row show">
                <Card className="card_body col-lg-8 col-sm-12 col-md-10 col-11 mx-auto " style={{ width: '40rem' }}>
                    <Form className="my-3" onSubmit={handleSubmit}>

                        <Form.Group>
                            <Form.Label>Select Location</Form.Label>
                            <Form.Control className="text-capitalize" name="location"
                                disabled
                                value={address}
                            // onChange={handleChange}
                            >
                            </Form.Control>
                        </Form.Group>

                        <Row>
                            <Form.Group className="col-md-6 col-12" controlId="exampleForm.dateTime">
                                <Form.Label>Date</Form.Label>
                                <Form.Control type="date" name="userDate" value={userDate}
                                    onChange={handleChange} />
                            </Form.Group>
                            <Form.Group className="col-md-6 col-12" controlId="exampleForm.dateTime">
                                <Form.Label>Select Slots</Form.Label>
                                <Form.Control as="select" name="slots" value={slots} onChange={handleChange}>
                                    <option value="" className="font-weight-bold">Select</option>
                                    {noOfSlots.map(value => {
                                        return <option key={value} value={value}>{value}</option>
                                    })}
                                </Form.Control>
                            </Form.Group>
                        </Row>
                        <Row>
                            <Form.Group className="col-md-6 col-12" controlId="exampleForm.dateTime">
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control type="time" name="startTime" value={startTime}
                                    onChange={handleChange}
                                />

                            </Form.Group>
                            <Form.Group className="col-md-6 col-12" controlId="exampleForm.dateTime">
                                <Form.Label>For Max</Form.Label>
                                <Form.Control as="select" name="endTime" value={endTime} onChange={handleChange}>
                                    <option value="" className="font-weight-bold">Select Hours</option>
                                    <option value="1">1 Hour</option>
                                    <option value="2">2 Hour</option>
                                    <option value="3">3 Hour</option>
                                    <option value="4">4 Hour</option>
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
