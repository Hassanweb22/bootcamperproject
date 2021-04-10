import React, { useState, useEffect } from 'react'
import { Table, Spinner } from "react-bootstrap"
import firebase from "../Components/firebase/index"


function AllBookings() {
    const [bookings, setBookings] = useState({})
    const [currentUser, setcurrentUser] = useState({})

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                firebase.database().ref("admin/").child("bookings").on("value", snapshot => {
                    console.log("Admin_AllBookings_FireBase", snapshot.val())
                    // setcurrentUser(snapshot.val())
                    if (snapshot.val()) {
                        setBookings(snapshot.val())
                    }
                })
            } else {
                console.log("No user Found", user?.uid)
            }
        });
        return () => {
            console.log("AllBooking Unmounted")
        }
    }, [])
    console.log({ currentUser })

    return (
        <div className="container my-5">
            <div className="users_heading">
                <h2 className="text-center text-capitalize" >All Users Bookings</h2>
            </div>
            <div className="row">
                {Object.keys(bookings).length === 0 ?
                    <div className="text-center mx-auto">
                        <Spinner animation="border" size="lg" variant="primary" />
                    </div>
                    : <Table size={window.innerWidth < 500 ? "sm" : "md"} className="text-capitalize card_body rounded-4 text-center" responsive striped bordered hover>
                        <thead className="align-content-center thead-dark">
                            <tr>
                                <th>Booking Id</th>
                                <th>location</th>
                                <th>Slot no</th>
                                <th>date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                            </tr>
                        </thead>
                        <tbody className="bg-light">
                            {Object.keys(bookings).map(key => {
                                return <tr key={key}>
                                    <td>{key}</td>
                                    <td>{bookings[key].location}</td>
                                    <td>{bookings[key].slots}</td>
                                    <td>{bookings[key].userDate}</td>
                                    <td>{bookings[key].startTime}</td>
                                    <td>{bookings[key].endTime} Hour</td>
                                </tr>
                            })}
                        </tbody>
                    </Table>}
            </div>
        </div >
    )
}

export default AllBookings;
