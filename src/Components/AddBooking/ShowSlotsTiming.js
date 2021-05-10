import React, { useState, useEffect } from 'react'
import { Table } from "react-bootstrap"
import moment from "moment"
import "./style.css"


function ShowSlotsTiming({ passData }) {
    const [currentLocation, setCurrentLocation] = useState([])

    useEffect(() => {
        setCurrentLocation(passData)
        return () => console.log("ShowSlotsTiming Unmounted")
    }, [passData])

    const getDuration = (array) => {
        let day = array[0] > 0 ? `${array[0]} Day ` : ""
        let hour = array[1] > 0 ? `${array[1]} Hour ` : ""
        let min = array[2] > 0 ? `${array[2]} Mins ` : ""
        return day + hour + min
    }

    return (
        <div className="showslotsTiming">
            <Table className="showBookings card_body rounded-4 text-center my-3" size="sm" responsive striped bordered hover>
                <thead className="align-content-center thead-dark">
                    <tr className="text-capitalize">
                        <th>slot no</th>
                        <th>Start Date</th>
                        <th>Start Time</th>
                        <th>End Date</th>
                        <th>End Time</th>
                        <th>Time Duration</th>
                    </tr>
                </thead>
                <tbody className="bg-light">
                    {currentLocation.length > 0 ? currentLocation.map((data, index) => {
                        let startTime = moment(data.userDate + " " + data.startTime)
                        let endTime = moment(data.endDate + " " + data.endTime)
                        let duration = getDuration(data.timeDuration)
                        return <tr className="text-capitalize" key={data.bookingId} >
                            <td>{data.slots}</td>
                            <td className="date">{data.userDate}</td>
                            <td className="time">{startTime.format("h:mm a")}</td>
                            <td className="date">{data.endDate}</td>
                            <td className="time">{endTime.format("h:mm a")}</td>
                            <td>{duration}</td>
                        </tr>
                    }) :
                        <tr>
                            <td className="no_data py-3" colSpan="6">No Reserved Slsots</td>
                        </tr>
                    }
                </tbody>
            </Table>
        </div >
    )
}

export default ShowSlotsTiming
