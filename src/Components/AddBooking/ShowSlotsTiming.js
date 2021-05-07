import React, { useState, useEffect } from 'react'
import { Table } from "react-bootstrap"
import moment from "moment"
import "./style.css"


function ShowSlotsTiming({ passData }) {
    const [currentLocation, setCurrentLocation] = useState([])
    useEffect(() => {
        console.log("passData", passData)
        setCurrentLocation(passData)
        return () => console.log("ShowSlotsTiming Unmounted")
    }, [passData])
    return (
        <div className="showslotsTiming">
            {/* <div className="d-flex justify-content-end">
                <p style={{ color: "#35dcb8" }}>{userDate}</p>
            </div> */}
            <Table className="card_body rounded-4 text-center my-3" size="sm" responsive striped bordered hover>
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
                        let duration = `${data.timeDuration[0]} Day ${data.timeDuration[1]} Hour ${data.timeDuration[2]} Minutes`
                        // let Total_time = moment(date).add(data.endTime, "hours").format("h:mm a")
                        return <tr className="text-capitalize" key={data.bookingId} >
                            <td>{data.slots}</td>
                            <td>{data.userDate}</td>
                            <td>{startTime.format("h:mm a")}</td>
                            <td>{data.endDate}</td>
                            <td>{endTime.format("h:mm a")}</td>
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
