import React, { useState, useEffect } from 'react'
import { Table } from "react-bootstrap"
import firebase from "../firebase/index"


function ShowBookings() {
    const [bookings, setBookings] = useState({})

    useEffect(() => {
        firebase.database().ref().on("value", snapshot => {
            if (snapshot.val() !== null) {
                console.log("getDataFromFBase", snapshot.val().users)
                setBookings(snapshot.val().users)
            }
        })
        return () => {
            console.log("something removed")
        }
    }, [])

    return (
        <div className="container mt-5">
            <h2 className="text-center text-capitalize main_heading mt-3">Show Bookings</h2>
            <div className="row">
                <Table className="text-center" responsive striped bordered hover>
                    <thead className="align-content-center thead-dark">
                        <tr className="text-capitalize">
                            <th>Booking Id</th>
                            <th>name</th>
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
                                <td>{bookings[show].username}</td>
                                <td>{bookings[show].location}</td>
                                <td>{bookings[show].userDate}</td>
                                <td>{bookings[show].startTime}</td>
                                <td>{bookings[show].endTime}</td>
                            </tr>
                        })}
                    </tbody>
                </Table>
            </div>
        </div>
    )
}

export default ShowBookings
