import React, { useState, useEffect } from 'react'
import { Table, Spinner } from "react-bootstrap"
import firebase from "../Components/firebase/index"
import moment from "moment"


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
                    : <Table size={window.innerWidth < 500 ? "sm" : "md"} className="text-capitalize card_body rounded-4 text-center" responsive striped bordered hover>
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
                                let date = user.userDate + " " + user.startTime
                                let Total_time = moment(date).add(parseInt(user.endTime), "hours").format("H:mm")
                                return <tr key={user.bookingId}>
                                    <td>{index + 1}</td>
                                    <td>{user.location}</td>
                                    <td>{user.slots}</td>
                                    <td>{user.userDate}</td>
                                    <td>{user.startTime}</td>
                                    <td>{Total_time}</td>
                                    <td>{user.endTime} Hours</td>
                                </tr>
                            })}
                        </tbody>
                    </Table>}
            </div>
        </div >
    )
}

export default AllBookings;
