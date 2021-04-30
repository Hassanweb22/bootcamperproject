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
        firebase.auth().onAuthStateChanged(function (user) {
            if (user !== null && user?.email !== "admin@gmail.com") {
                firebase.database().ref("clients/").child(user?.uid).on("value", snapshot => {
                    console.log("ShowBookings userData FireBase", snapshot.val())
                    setCurrentUser(snapshot.val())
                    if (snapshot.val()?.bookings) {
                        setBookings(snapshot.val()?.bookings)
                    }
                })
            } else {
                setCurrentUser({})
            }
        });
        return () => {
            console.log("ShowBooking Unmounted")
        }
    }, [])
    // console.log({ currentUser })

    return (
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
                                <th>date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Total Time</th>
                            </tr>
                        </thead>
                        {/* console.log("Time", {startTime: user.startTime, endTime: moment(date).add(2, "hours").format("H:mm") }) */}
                        <tbody className="bg-light">
                            {Object.keys(bookings).map((key, index) => {
                                let startTime = moment(bookings[key].userDate + " " + bookings[key].startTime)
                                let endTime = moment(bookings[key].userDate + " " + bookings[key].endTime)
                                // let Total_time = moment(date).add(bookings[key].endTime, "hours").format("h:mm a")
                                return <tr className="text-capitalize" key={key}>
                                    <td>{index + 1}</td>
                                    <td>{bookings[key].location}</td>
                                    <td>{bookings[key].slots}</td>
                                    <td>{bookings[key].userDate}</td>
                                    <td>{startTime.format("h:mm a")}</td>
                                    <td>{endTime.format("h:mm a")}</td>
                                    <td>{bookings[key].totalTime}</td>
                                </tr>
                            })}
                        </tbody>
                    </Table>}
            </div>
        </div >
    )
}

export default withRouter(ShowBookings)
