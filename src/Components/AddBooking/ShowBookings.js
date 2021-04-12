import React, { useState, useEffect } from 'react'
import { Table, Spinner } from "react-bootstrap"
import firebase from "../firebase/index"
import moment from "moment"
import "./style.css"


function ShowBookings() {
    const [bookings, setBookings] = useState({})
    const [currentUser, setcurrentUser] = useState({})

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user?.email !== "admin@gmail.com") {
                firebase.database().ref("clients/").child(user?.uid).on("value", snapshot => {
                    console.log("ShowBookings userData FireBase", snapshot.val())
                    setcurrentUser(snapshot.val())
                    if (snapshot.val()?.bookings) {
                        setBookings(snapshot.val()?.bookings)
                    }
                })
            } else {
                console.log("No user Found", user?.uid)
            }
        });
        return () => {
            console.log("ShowBooking Unmounted")
        }
    }, [])
    // console.log({ currentUser })

    return (
        <div className="container my-5">
            <div className="users_heading">
                <h2 className="text-center text-capitalize" >Your Bookings</h2>
            </div>
            <div className="row">
                {Object.keys(bookings).length === 0 ?
                    <div className="text-center mx-auto">
                        <h2 className="no_bookings">No Bookings Yet</h2>
                    </div>
                    : <Table className="card_body rounded-4 text-center" responsive striped bordered hover>
                        <thead className="align-content-center thead-dark">
                            <tr className="text-capitalize">
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
                            {Object.keys(bookings).map(key => {
                                let date = bookings[key].userDate + " " + bookings[key].startTime
                                let Total_time = moment(date).add(2, "hours").format("H:mm")
                                return <tr className="text-capitalize" key={key}>
                                    <td>{bookings[key].location}</td>
                                    <td>{bookings[key].slots}</td>
                                    <td>{bookings[key].userDate}</td>
                                    <td>{bookings[key].startTime}</td>
                                    <td>{Total_time}</td>
                                    <td>{bookings[key].endTime} Hours</td>
                                </tr>
                            })}
                        </tbody>
                    </Table>}
            </div>
        </div >
    )
}

export default ShowBookings
