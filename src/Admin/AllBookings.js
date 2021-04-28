import React, { useState, useEffect } from 'react'
import { Table, Spinner } from "react-bootstrap"
import firebase from "../Components/firebase/index"
import moment from "moment"
import './style.css';


function AllBookings() {
    const [bookings, setBookings] = useState({})
    const [newArray, setnewArray] = useState([])
    const [currentUser, setcurrentUser] = useState({})

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                let newArray = []
                firebase.database().ref("clients/").on("value", snapshot => {
                    console.log("AllBookings userData FireBase", snapshot.val())
                    let bookings = Object.keys(snapshot.val()).map(user => {
                        if (snapshot.val()[user].hasOwnProperty('bookings') === true) {
                            return Object.keys(snapshot.val()[user]?.bookings).map(val => newArray.push(snapshot.val()[user]?.bookings[val]))
                        }
                    })
                    setnewArray(newArray)
                })
            } else {
                console.log("No user Found", user?.uid)
            }
        });
        return () => {
            console.log("AllBooking Unmounted")
        }
    }, [])
    console.log({ newArray })

    return (
        <div className="container my-5">
            <div className="users_heading">
                <h2 className="text-center text-capitalize" >All Users Bookings</h2>
            </div>
            <div className="row">
                {newArray.length === 0 ?
                    <div className="text-center mx-auto">
                        <Spinner animation="border" size="lg" variant="primary" />
                    </div>
                    : <div className="col-lg-12 col-12 allBookings">
                        <Table size={window.innerWidth < 500 ? "sm" : "md"} className="text-capitalize card_body rounded-4 text-center" responsive striped bordered hover>
                            <thead className="align-content-center thead-dark">
                                <tr>
                                    <th>#</th>
                                    <th>location</th>
                                    <th>Slot no</th>
                                    <th>date</th>
                                    <th>Start Time</th>
                                    <th>End Time</th>
                                    <th>Total Time</th>
                                </tr>
                            </thead>
                            <tbody className="bg-light">
                                {newArray.map((user, index) => {
                                    let startTime = moment(user.userDate + " " + user.startTime)
                                    let endTime = moment(user.userDate + " " + user.endTime)

                                    return <tr key={user.bookingId}>
                                        <td>{index + 1}</td>
                                        <td>{user.location}</td>
                                        <td>{user.slots}</td>
                                        <td>{user.userDate}</td>
                                        <td>{startTime.format("h:mm a")}</td>
                                        <td>{endTime.format("h:mm a")}</td>
                                        <td>{user.totalTime} Hours</td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </div>}
            </div>
        </div >
    )
}

export default AllBookings;
