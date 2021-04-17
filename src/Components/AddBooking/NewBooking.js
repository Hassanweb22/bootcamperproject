import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Row } from "react-bootstrap"
import { ArrowLeftCircleFill, ArrowRightCircleFill } from "react-bootstrap-icons"
import ShowSlotsTiming from './ShowSlotsTiming.js'
// import { X } from "react-bootstrap-icons"
import { useHistory, useParams } from 'react-router-dom'
import firebase from "../firebase/index.js"
import moment from "moment"
import { extendMoment } from 'moment-range';
import "../style.css"


export default function NewBookings() {
    const { address } = useParams()
    const history = useHistory()
    const momentRange = extendMoment(moment);
    let initialState = {
        username: "",
        location: address,
        userDate: "",
        startTime: "",
        endTime: "",
        slots: undefined
    }

    const [state, setState] = useState(initialState)
    const [slotNo, setSlotNo] = useState("")
    const [bookings, setBookings] = useState([])
    let [noOfSlots, setNoOfSlots] = useState([])
    let [showSlots, setShowSlots] = useState(false)
    let [slotsAvailablity, setSlotsAvailablity] = useState(false)
    let [error, setError] = useState({
        isAfter: "",
        conflicit: ""
    })
    let { location, slots, userDate, startTime, endTime } = state

    useEffect(() => {
        let newArray = []
        firebase.database().ref("clients/").on("value", snapshot => {
            // console.log("NewBookings userData FireBase", snapshot.val())
            let bookings = Object.keys(snapshot.val()).map(user => {
                if (snapshot.val()[user].hasOwnProperty('bookings')) {
                    return Object.keys(snapshot.val()[user]?.bookings).map(val => console.log("return", newArray.push(snapshot.val()[user]?.bookings[val])))
                }
            })
            // bookings.map(user => {
            //     Array(user).map(val => {
            //         if (Array.isArray(val)) {
            //             val.forEach(element => {
            //                 newArray.push(element)
            //             });
            //         }
            //     })
            // })
            console.log("new array", newArray)
            setBookings(newArray)
        })

        setNoOfSlots(Array(5).fill(1).map((x, y) => x + y))
        setShowSlots(false)

        return () => console.log("newbOOKING unmounted")
    }, [])

    let checkSlot = () => {
        setShowSlots(true)
        let endingTime = moment(userDate + " " + startTime).add(endTime, "hours")
        let startToEnding = (userDate, startTime, endTime) => moment(userDate + " " + startTime).add(endTime, "hours")
        let date = () => bookings.filter((val, index) => {
            if (val.location == location && moment(userDate).isSame(val.userDate)) {
                const date1 = [moment(userDate + " " + startTime), endingTime];
                const date2 = [moment(val.userDate + " " + val.startTime), startToEnding(val.userDate, val.startTime, val.endTime)];

                const range = momentRange.range(date1);
                const range2 = momentRange.range(date2);

                // has overlapping
                if (range.overlaps(range2)) {
                    console.log("overlaps completely")
                    if ((range2.contains(range, true) || range.contains(range2, true)) && !date1[0].isSame(date2[0])) {
                        // setError({ ...error, conflicit: `Some Slots are missing bcz Your Time range completely conflict at it` });
                        return true
                    }
                    else {
                        console.log("overlaps partially")
                        // setError({ ...error, conflicit: `Some Slots are missing bcz Your Time range partially conflict at it` });
                        return true
                    }
                }
            }
        });
        if (date().length > 0) {
            console.log("date()", date())
            let copySlots = Array(5).fill(1).map((x, y) => x + y)
            let toRemove = []
            date().map(val => toRemove.push(val.slots))
            console.log("toremove IF", toRemove)
            copySlots = copySlots.filter(val => !toRemove.includes(val))
            console.log("nofslots IF", copySlots)
            setNoOfSlots(copySlots);

            // setNoOfSlots(noOfSlots.filter(no => no !== val.slots))
        }
        else {
            console.log("noOfSlots Else", noOfSlots)
            setNoOfSlots(Array(5).fill(1).map((x, y) => x + y))
        }
    }

    const handleChange = (e) => {
        let { name, value } = e.target
        setState({
            ...state,
            [name]: value,
        })
        setShowSlots(false)
        // checkSlot()
        setSlotNo("")
        setError("")
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log("state", state)
        const { uid } = firebase.auth().currentUser
        let isAfter = moment(userDate + ' ' + startTime).add(endTime, "hours").isAfter(userDate + ' ' + "24:00");
        if (isAfter) {
            setError({ ...error, isAfter: "Time Should Not exceed 24 hours" })
            console.log("isafter", isAfter, error)
        }
        else {
            const key = firebase.database().ref("clients").child(uid).child("/bookings").push().key
            let bookingObj = { bookingId: key, location, slots: slotNo, userDate, startTime, endTime }
            console.log("bookingObj", bookingObj)
            firebase.database().ref('clients/').child(uid).child(`/bookings/${key}`).set(
                bookingObj,
                err => {
                    if (err) {
                        console.log("error", err)
                    }
                });
            // let adminBookingObj = { bookingId: key, uid, location, slots: slotNo, userDate, startTime, endTime }
            // firebase.database().ref('admin/').child(`/bookings/${key}`).set(
            //     adminBookingObj,
            //     err => {
            //         if (err) {
            //             console.log("error", err)
            //         }
            //     });
        }

        // setState(initialState)
    }

    let validate = () => (location && userDate && startTime && endTime && slotNo) ? true : false
    let slotsValidate = () => (userDate && startTime && endTime) ? true : false


    return (

        <div className="container my-3">
            <div className="users_heading">
                <h2 className="text-center text-capitalize">
                    Parking Booking
                </h2>
            </div>
            <div className="row show">
                <Card className="card_body col-lg-8 col-sm-12 col-md-10 col-11 mx-auto " style={{ width: '40rem' }}>
                    <Form className="my-3" onSubmit={handleSubmit}>
                        <Row>
                            <Form.Group className="col-md-6 col-12">
                                <Form.Label>Select Location</Form.Label>
                                <Form.Control className="text-capitalize" name="location"
                                    disabled
                                    value={address}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group className="col-md-6 col-12" controlId="exampleForm.dateTime">
                                <Form.Label>Date</Form.Label>
                                <Form.Control type="date" min={moment().format("YYYY-MM-DD")} name="userDate" value={userDate}
                                    onChange={handleChange} />
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group className="col-md-6 col-12" controlId="exampleForm.dateTime">
                                <Form.Label>Start Time</Form.Label>
                                <Form.Control type="time" step="3600" name="startTime" value={startTime}
                                    onChange={handleChange}
                                />

                            </Form.Group>
                            <Form.Group className="col-md-6 col-12" controlId="exampleForm.dateTime">
                                <Form.Label>End Time (For)</Form.Label>
                                <Form.Control as="select" name="endTime" value={endTime} onChange={handleChange}>
                                    <option value="" className="font-weight-bold">Select Hours</option>
                                    <option value="1">1 Hour</option>
                                    <option value="2">2 Hour</option>
                                    <option value="3">3 Hour</option>
                                    <option value="4">4 Hour</option>
                                </Form.Control>
                                {error.isAfter ? <small className="text-danger">{error.isAfter}</small> : null}
                            </Form.Group>
                        </Row>

                        <Row>
                            <Form.Group className="col-md-12" controlId="exampleForm.dateTime">
                                <Form.Label>Slot No:</Form.Label>
                                <Form.Control disabled={true} name="slotNo"
                                    value={slotNo}>
                                    {/* <option value="" className="font-weight-bold">Select</option>
                                    {noOfSlots.map(value => {
                                        return <option key={value} value={value}>{value}</option>
                                    })} */}
                                </Form.Control>
                            </Form.Group>
                        </Row>
                        <div className="container">
                            <Row className="d-flex justify-content-around">
                                <Button type="button" className="col-md-5 col-12" variant="outline-primary" color="primary" onClick={_ => { checkSlot(); setSlotsAvailablity(false) }} disabled={!slotsValidate()}>Show Slots</Button>
                                <Button className="col-md-6 col-12" variant="primary" type="submit" disabled={!validate()}>Book Slot</Button>
                            </Row>
                        </div>
                    </Form>
                </Card>
            </div>

            <div className="row my-3 slots_Card">
                <Card className="container-fluid card_body col-lg-12 col-sm-12 col-md-12 col-12 mx-auto p-3" >
                    <div className="slots_nav">
                        <Button variant="success" onClick={_ => setSlotsAvailablity(!slotsAvailablity)}>{!slotsAvailablity ? "Booked" : "Available"} Slots</Button>
                    </div>
                    {slotsAvailablity ?
                        <ShowSlotsTiming userDate={state.userDate} address={address} bookings={bookings} />
                        : showSlots ?
                            <>
                                <p className="text-center text-info mt-3">Select any one from the folllowing Available Slots </p>
                                <Row className="text-center">
                                    {noOfSlots.map(slot => {
                                        return <Button variant="warning" onClick={() => setSlotNo(slot)} key={slot}>{slot}</Button>
                                    })}
                                    <p className=" d-block mt-2 text-danger">{error.conflicit} </p>
                                </Row>
                            </> : <p className="text-center my-5">Press (Show Slots) Button After filling all fields To see available Slots</p>
                    }
                </Card>
            </div >
        </div >
    )
}
