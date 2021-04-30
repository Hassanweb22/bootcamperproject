import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Row } from "react-bootstrap"
import ShowSlotsTiming from './ShowSlotsTiming.js'
import { useHistory, useParams, Link } from 'react-router-dom'
import firebase from "../firebase/index.js"
import moment from "moment"
import { extendMoment } from 'moment-range';
import { withRouter } from 'react-router-dom';
import "../style.css"


function NewBookings(props) {
    const { address, totalSlots } = useParams()
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
    let inititialErrors = {
        isAfter: "",
        conflicit: "",
        timeLimit: ""
    }

    const [state, setState] = useState(initialState)
    const [slotNo, setSlotNo] = useState("")
    const [bookings, setBookings] = useState([])
    let [noOfSlots, setNoOfSlots] = useState([])
    let [showSlots, setShowSlots] = useState(false)
    let [slotsAvailablity, setSlotsAvailablity] = useState(false)
    let [bookSlot, setBookSlot] = useState(false)
    let [error, setError] = useState(inititialErrors)
    let { location, slots, userDate, startTime, endTime } = state

    useEffect(() => {
        firebase.database().ref("clients/").on("value", snapshot => {
            let newArray = []
            let bookings = Object.keys(snapshot.val()).map(user => {
                if (snapshot.val()[user].hasOwnProperty('bookings')) {
                    return Object.keys(snapshot.val()[user]?.bookings).map(val => newArray.push(snapshot.val()[user]?.bookings[val]))
                }
            })
            setBookings(newArray)
            // console.log("new array", newArray)
            // console.log({ address, totalSlots: parseInt(totalSlots) })
        })

        setNoOfSlots(Array(parseInt(totalSlots)).fill(1).map((x, y) => x + y))
        // setShowSlots(false)

        return () => console.log("newbOOKING unmounted")
    }, [])

    let checkSlot = () => {
        setShowSlots(true)
        let date = () => bookings.filter((val, index) => {
            if (val.location == location && moment(userDate).isSame(val.userDate)) {
                const date1 = [moment(userDate + " " + startTime), moment(userDate + " " + endTime)];
                const date2 = [moment(val.userDate + " " + val.startTime), moment(val.userDate + " " + val.endTime)];

                const range = momentRange.range(date1);
                const range2 = momentRange.range(date2);

                // has overlapping
                if (range.overlaps(range2)) {
                    console.log("overlaps completely")
                    if ((range2.contains(range, true) || range.contains(range2, true)) && !date1[0].isSame(date2[0])) {
                        setError({ ...error, conflicit: `Some Slots are missing bcz Your Time range completely conflict at it` });
                        return true
                    }
                    else {
                        console.log("overlaps partially")
                        setError({ ...error, conflicit: `Some Slots are missing bcz Your Time range partially conflict at it` });
                        return true
                    }
                }
            }
        });
        if (date().length > 0) {
            console.log("date()", date())
            let copySlots = Array(parseInt(totalSlots)).fill(1).map((x, y) => x + y)
            let toRemove = []
            date().map(val => toRemove.push(parseInt(val.slots)))
            console.log("toremove IF", toRemove)
            copySlots = copySlots.filter(val => !toRemove.includes(val))
            console.log("nofslots IF", copySlots)
            setNoOfSlots(copySlots);

            // setNoOfSlots(noOfSlots.filter(no => no !== val.slots))
        }
        else {
            console.log("noOfSlots Else", noOfSlots)
            setNoOfSlots(Array(parseInt(totalSlots)).fill(1).map((x, y) => x + y))
        }
    }

    const startTimeValidate = () => {
        return userDate ? true : false
    }

    const handleChange = (e) => {
        let { name, value } = e.target
        setState({
            ...state,
            [name]: value,
        })
        setShowSlots(false)
        setBookSlot(false)
        setSlotNo("")
        setError(inititialErrors)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const { uid } = firebase.auth().currentUser
        const totalTime = moment.utc(moment(userDate + " " + endTime).diff(moment(userDate + " " + startTime))).format("H:mm")
        const hours = moment.utc(moment(userDate + " " + endTime).diff(moment(userDate + " " + startTime))).format("H")
        const min = moment.utc(moment(userDate + " " + endTime).diff(moment(userDate + " " + startTime))).format("mm")
        const add = moment(userDate + ' ' + startTime).add(hours, "hours").add(min, "minutes")

        let timeLimit = moment(userDate + " " + totalTime).isAfter(userDate + ' ' + "00:10")
        let isAfter = add.isAfter(userDate + ' ' + "24:00");
        if (isAfter) {
            setError({ ...error, isAfter: "Time Should Not exceed 24 hours" })
            console.log("isafter", isAfter, error.isAfter)
        }
        else if (!timeLimit) {
            setError({ ...error, timeLimit: "Time duration must be greater than 10 Minutes" })
            console.log("timeLimit", timeLimit, error.timeLimit)
        }
        else {
            setBookSlot(false)
            const key = firebase.database().ref(`clients/${uid}/`).child("bookings").push().key
            let bookingObj = { bookingId: key, uid, location, slots: slotNo, userDate, startTime, endTime, totalTime }
            console.log("bookingObj", bookingObj)
            firebase.database().ref(`clients/${uid}/`).child("bookings").child(key).set(
                bookingObj,
                err => {
                    if (err) {
                        console.log("error", err)
                    }
                });
            setState(initialState)
            setSlotNo("")
            setSlotsAvailablity(false)
        }

    }

    let getMinimumTime = () => {
        return moment
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
                                <Form.Control type="time" name="startTime"
                                    value={startTime}
                                    min={userDate == moment().format("YYYY-MM-DD") ? moment().format("H:mm") : ""}
                                    disabled={!startTimeValidate()}
                                    onChange={handleChange}
                                />

                            </Form.Group>
                            <Form.Group className="col-md-6 col-12" controlId="exampleForm.dateTime">
                                <Form.Label>End Time (For)</Form.Label>
                                <Form.Control type="time" name="endTime"
                                    value={endTime}
                                    onChange={handleChange}
                                />
                                {error.isAfter || error.timeLimit ? <small className="text-danger">{error.isAfter || error.timeLimit}</small> : null}
                            </Form.Group>
                        </Row>

                        {/* <Row>
                            <Form.Group className="col-md-12" controlId="exampleForm.dateTime">
                                <Form.Label>Slot No:</Form.Label>
                                <Form.Control disabled={true} name="slotNo"
                                    value={slotNo}>
                                </Form.Control>
                            </Form.Group>
                        </Row> */}
                        <div className="container">
                            <Row className="d-flex justify-content-around">
                                {!bookSlot ? <Button type="button" className="col-12 mb-2 mb-md-0 mb-lg-0" variant="outline-primary" color="primary" onClick={_ => { setBookSlot(true); checkSlot(); setSlotsAvailablity(false) }} disabled={!slotsValidate()}>Show Slots</Button>
                                    : <Button className="col-12" variant="primary" type="submit" disabled={!validate()}>Book Slot</Button>
                                }
                            </Row>
                        </div>
                    </Form>
                </Card>
            </div>

            <div className="row my-3 slots_Card mb-4" style={{ marginBottom: "20px !important" }}>
                <Card className="container-fluid card_body bottom_card col-lg-12 col-sm-12 col-md-12 col-12 mx-auto p-3" >
                    <div className="slots_nav">
                        {userDate && <small className="text-info text-center">To see {!slotsAvailablity ? "Booked" : "Available"} Slots of this Date: {userDate} <span style={{ cursor: "pointer", color: "red" }} onClick={_ => setSlotsAvailablity(!slotsAvailablity)}>&nbsp; Click Here</span></small>}
                    </div>
                    {slotsAvailablity ?
                        <ShowSlotsTiming userDate={state.userDate} address={address} bookings={bookings} />
                        : showSlots ?
                            <>
                                <p className="text-center text-info mt-2 select">Select any one of the folllowing Available Slots</p>
                                <Row className="text-center">
                                    {noOfSlots.map(slot => {
                                        return <Button className={`${slotNo === slot ? "buttonActive" : ""} `} variant="warning" onClick={() => setSlotNo(slot)} key={slot}>{slot}</Button>
                                    })}
                                    <p className="w-100 d-block mt-2" style={{ color: "white" }}>{error.conflicit} </p>
                                </Row>
                            </> : <p className="text-center my-auto" style={{ color: "white" }}>Press (Show Slots) Button After filling all fields To see available Slots</p>
                    }
                </Card>
            </div >
        </div >
    )
}

export default withRouter(NewBookings);
