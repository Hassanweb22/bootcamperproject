import React, { useState, useEffect } from 'react'
import { Table, Spinner } from "react-bootstrap"
import { ArrowLeftCircleFill, ArrowRight, ArrowRightCircleFill } from "react-bootstrap-icons"
import firebase from "../firebase/index"
import moment from "moment"
import { useHistory, withRouter } from "react-router-dom"
import "./style.css"


function ShowBookings() {
    const history = useHistory()
    const [bookings, setBookings] = useState({})
    const [currentUser, setCurrentUser] = useState({})

    useEffect(() => {
        const get = async () => {
            await firebase.auth().onAuthStateChanged(function (user) {
                if (user !== null && user?.email !== "admin@gmail.com") {
                    firebase.database().ref("clients/").child(user?.uid).on("value", snapshot => {
                        setCurrentUser(snapshot.val())
                        if (snapshot.val()?.bookings) {
                            setBookings(snapshot.val()?.bookings)
                        }
                    })
                }
            });
        }
        get()
    }, [])

    return (
        Object.keys(currentUser).length ?
            <>
                <div className="container my-5" >
                    <div className="users_heading">
                        <h2 className="text-center text-capitalize" >
                            <ArrowLeftCircleFill onClick={() => history.goBack()} style={{ fontWeight: "bold", cursor: "pointer" }} />
                    &nbsp;Your Bookings&nbsp;
                    <ArrowRightCircleFill onClick={() => history.goForward()} style={{ fontWeight: "bold", cursor: "pointer" }} />
                        </h2>
                    </div>
                    <div className="row">
                        {Object.keys(bookings).length === 0 ?
                            <div className="text-center mx-auto">
                                <h2 className="no_bookings">No Bookings Yet</h2>
                            </div>
                            : <Table className="card_body rounded-4 text-center" responsive striped bordered hover>
                                <thead className="align-content-center thead-dark">
                                    <tr className="text-capitalize">
                                        <th>#</th>
                                        <th>location</th>
                                        <th>slot no</th>
                                        <th>Start Date</th>
                                        <th>Start Time</th>
                                        <th>End Date</th>
                                        <th>End Time</th>
                                        <th>Time Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-light">
                                    {Object.keys(bookings).map((key, index) => {
                                        let startTime = moment(bookings[key].userDate + " " + bookings[key].startTime)
                                        let endTime = moment(bookings[key].endDate + " " + bookings[key].endTime)
                                        let duration = `${bookings[key].timeDuration[0]} Day ${bookings[key].timeDuration[1]} Hour ${bookings[key].timeDuration[2]} Minutes`
                                        return <tr className="text-capitalize" key={key}>
                                            <td>{index + 1}</td>
                                            <td>{bookings[key].location}</td>
                                            <td>{bookings[key].slots}</td>
                                            <td>{bookings[key].userDate}</td>
                                            <td>{startTime.format("h:mm a")}</td>
                                            <td>{bookings[key].endDate}</td>
                                            <td>{endTime.format("h:mm a")}</td>
                                            <td>{duration}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </Table>}
                    </div>
                </div >
            </> : null
    )
}

export default withRouter(ShowBookings)
