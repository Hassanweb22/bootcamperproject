import React, { useState, useEffect } from 'react'
import { Table } from "react-bootstrap"
import moment from "moment"
import "./style.css"


function ShowSlotsTiming({ bookings, address, userDate }) {
    const [currentLocation, setCurrentLocation] = useState([])
    useEffect(() => {
        // console.log("ShowSlotsTiming Bookings", bookings, address, userDate)
        let location = bookings.filter(data => data.location === address && data.userDate === userDate)
        // console.log("currentLocation", location)
        setCurrentLocation(location)
        return () => console.log("ShowSlotsTiming Unmounted")
    }, [userDate, bookings])
    return (
        <div className="showslotsTiming">
            <div className="d-flex justify-content-end">
                <p style={{ color: "#35dcb8" }}>{userDate}</p>
            </div>
            <Table className="card_body rounded-4 text-center" size="sm" responsive striped bordered hover>
                <thead className="align-content-center thead-dark">
                    <tr className="text-capitalize">
                        <th>slot no</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Total Time</th>
                    </tr>
                </thead>
                <tbody className="bg-light">
                    {currentLocation.length > 0 ? currentLocation.map((data, index) => {
                        let startTime = moment(data.userDate + " " + data.startTime)
                        let endTime = moment(data.userDate + " " + data.endTime)
                        // let Total_time = moment(date).add(data.endTime, "hours").format("h:mm a")
                        return <tr className="text-capitalize" key={data.bookingId} >
                            <td>{data.slots}</td>
                            <td>{startTime.format("h:mm a")}</td>
                            <td>{endTime.format("h:mm a")}</td>
                            <td>{data.totalTime}</td>
                        </tr>
                    }) :
                        <tr>
                            <td className="no_data py-3" colSpan="6">No Slots Booked for this Date: {userDate}</td>
                        </tr>
                    }
                </tbody>
            </Table>
        </div >
    )
}

export default ShowSlotsTiming
