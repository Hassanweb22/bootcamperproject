import React, { useState, useEffect } from 'react'
import { Table, Spinner } from "react-bootstrap"
import firebase from "../firebase/index"


function ShowBookings() {
    const [bookings, setBookings] = useState({})
    const [currentUser, setcurrentUser] = useState({})

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                firebase.database().ref("clients/").child(user.uid).on("value", snapshot => {
                    console.log("ShowBookings userData FireBase", snapshot.val())
                    setcurrentUser(snapshot.val())
                    if (snapshot.val().bookings) {
                        setBookings(snapshot.val().bookings)
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
    console.log({ currentUser })

    return (
        <div className="container mt-5">
            <div className="users_heading">
                <h2 className="text-center text-capitalize" >Your Bookings</h2>
            </div>
            <div className="row">
                {Object.keys(bookings).length === 0 ?
                    <div className="text-center mx-auto">
                        <Spinner  animation="border" size="lg" variant="primary" />
                    </div>
                    : <Table className="card_body rounded-4 text-center" responsive striped bordered hover>
                        <thead className="align-content-center thead-dark">
                            <tr className="text-capitalize">
                                <th>Booking Id</th>
                                <th>location</th>
                                <th>date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.keys(bookings).map(show => {
                                return <tr key={show}>
                                    <td>{show}</td>
                                    <td>{bookings[show].location}</td>
                                    <td>{bookings[show].userDate}</td>
                                    <td>{bookings[show].startTime}</td>
                                    <td>{bookings[show].endTime}</td>
                                </tr>
                            })}
                        </tbody>
                    </Table>}
            </div>
        </div >
    )
}

export default ShowBookings
