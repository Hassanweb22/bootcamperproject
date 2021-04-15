import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Row } from "react-bootstrap"
import { ArrowLeftCircleFill, ArrowRightCircleFill } from "react-bootstrap-icons"
import ShowSlotsTiming from './ShowSlotsTiming.js'
// import { X } from "react-bootstrap-icons"
import { useHistory, useParams } from 'react-router-dom'
import firebase from "../firebase/index.js"
import moment from "moment"
import "../style.css"


export default function NewBookings() {
    const { address } = useParams()
    const history = useHistory()
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
    let [error, setError] = useState("")
    let { location, slots, userDate, startTime, endTime } = state

    useEffect(() => {
        let newArray = []
        firebase.database().ref("clients/").on("value", snapshot => {
            // console.log("NewBookings userData FireBase", snapshot.val())
            let bookings = Object.keys(snapshot.val()).map(user => {
                if (snapshot.val()[user].hasOwnProperty('bookings') === true) {
                    return Object.keys(snapshot.val()[user]?.bookings).map(val => snapshot.val()[user]?.bookings[val])
                }
            })
            bookings.map(user => {
                Array(user).map(val => {
                    if (Array.isArray(val)) {
                        val.forEach(element => {
                            newArray.push(element)
                        });
                    }
                })
            })
            console.log(newArray)
            setBookings(newArray)
        })

        // setNoOfSlots(Array(5).fill(1).map((x, y) => x + y))

        return () => console.log("newbOOKING unmounted")
    }, [])

    let checkSlot = () => {
        setShowSlots(true)
        let endingTime = moment(userDate + " " + startTime).add(endTime, "hours")
        let startToEnding = (userDate, startTime, endTime) => moment(userDate + " " + startTime).add(endTime, "hours")
        // console.log({ endingTime })
        let date = () => bookings.find(val => {
            if (val.location == location && moment(userDate).isSame(val.userDate)
                && (moment(userDate + " " + startTime).isBetween(val.userDate + " " + val.startTime, startToEnding(val.userDate, val.startTime, val.endTime), undefined, "[)")
                    || endingTime.isBetween(val.userDate + " " + val.startTime, startToEnding(val.userDate, val.startTime, val.endTime), undefined, "(]"
                    ))) {
                return true
            }
        })
        console.log("isSame Date:", date())
        if (date()?.slots) {
            setNoOfSlots(Array(5).fill(1).map((x, y) => x + y).filter(no => no != date().slots))
        }
        else {
            setNoOfSlots(Array(5).fill(1).map((x, y) => x + y))
        }
    }
    // useEffect(() => {

    //     // let abc = bookings.length && bookings.filter(val => moment(state.userDate).isSame(val.userDate));
    //     // console.log(abc, "asff")
    //     // var beginningTime = moment('8:45am', 'h:mma');
    //     // var endTime = moment('9:00am', 'h:mma');
    //     bookings.map(user => {
    //         let date = user.userDate + " " + user.startTime
    //         // console.log("add 2 hours", moment(date).add(2, "hours").format("H:mm"))
    //         console.log("Time", { startTime: user.startTime, endTime: moment(date).add(2, "hours").format("H:mm") })
    //     })
    //     // console.log("Momentjs", moment().add(2, 'hours').format("YYYY/MM/DD  h:mm:A"))
    //     // console.log("Time", moment().format("h:mm a").add(2, 'hours'))

    // }, [])
    // console.log("bookings", bookings)

    const handleChange = (e) => {
        let { name, value } = e.target
        setState({
            ...state,
            [name]: value,
        })
        let isAfter = moment(userDate + ' ' + startTime).add(endTime, "hours").isAfter(userDate + ' ' + "23:59")
        if (isAfter) {
            setError("Time Should Not exceed 24 hours")
            console.log({error})
        }
        else {
            setError("")
        }
        setShowSlots(false)
        // checkSlot()
        setSlotNo("")
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("state", state)
        const { uid } = firebase.auth().currentUser
        const key = firebase.database().ref("clients").child(uid).child("/bookings").push().key
        let bookingObj = { bookingId: key, location, slots, userDate, startTime, endTime }
        let adminBookingObj = { bookingId: key, uid, location, slots, userDate, startTime, endTime }
        // console.log("bookingObj", bookingObj)
        // firebase.database().ref('clients/').child(uid).child(`/bookings/${key}`).set(
        //     bookingObj,
        //     err => {
        //         if (err) {
        //             console.log("error", err)
        //         }
        //     });
        // firebase.database().ref('admin/').child(`/bookings/${key}`).set(
        //     adminBookingObj,
        //     err => {
        //         if (err) {
        //             console.log("error", err)
        //         }
        //     });
        let isafter = moment(userDate + ' ' + startTime).add(endTime, "hours").isAfter(userDate + ' ' + "23:59");
        console.log("isafter", isafter)
        console.log("isafter", error)
        // setState(initialState)
    }

    let validate = () => (location && userDate && startTime && endTime && slotNo) ? true : false
    let slotsValidate = () => (userDate && startTime && endTime) ? true : false


    return (

        <div className="container my-3">
            <div className="users_heading">
                <h2 className="text-center text-capitalize">
                    <ArrowLeftCircleFill onClick={() => history.goBack()} style={{ fontWeight: "bold", cursor: "pointer" }} />
                   &nbsp;Parking Booking&nbsp;
                    <ArrowRightCircleFill onClick={() => history.goForward()} style={{ fontWeight: "bold", cursor: "pointer" }} />
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
                                {error ? <small className="text-danger">{error}</small> : null}
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
                        <Button variant="success" onClick={_ => setSlotsAvailablity(false)}>Avaliable Slots</Button>
                        <Button variant="success" onClick={_ => setSlotsAvailablity(true)}>Booked Slots</Button>
                    </div>
                    {slotsAvailablity ?
                        <ShowSlotsTiming userDate={state.userDate} address={address} bookings={bookings} />
                        : showSlots ?
                            <Row className="mt-4 text-center">
                                {noOfSlots.map(slot => {
                                    return <Button variant="warning" onClick={() => setSlotNo(slot)} key={slot}>{slot}</Button>
                                })}
                            </Row> : <p className="text-center my-5">Press (Show Slots) Button After filling all fields To see available Slots</p>
                    }
                </Card>
            </div >
        </div >
    )
}
