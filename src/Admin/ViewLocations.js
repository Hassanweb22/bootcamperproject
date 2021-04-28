import React, { useState, useEffect } from 'react'
import { Table, Spinner } from "react-bootstrap"
import firebase from "../Components/firebase/index"
import moment from "moment"
import './style.css';


function ViewLocations() {

    const [allLocations, setAllLocations] = useState({})

    useEffect(() => {
        firebase.database().ref("admin").child("locations").on("value", snapshot => {
            // console.log("Firebase Locations", snapshot.val())
            setAllLocations(snapshot.val())
        })
        return () => console.log("")
    }, [])


    return (
         <div className="container my-5">
            <div className="users_heading">
                <h2 className="text-center text-capitalize" >All Locations</h2>
            </div>
            <div className="row">
                {Object.keys(allLocations).length === 0 ?
                    <div className="text-center mx-auto">
                        <Spinner animation="border" size="lg" variant="primary" />
                    </div>
                    : <div className="col-lg-12 col-12 allBookings">
                        <Table size={window.innerWidth < 500 ? "sm" : "md"} className="text-capitalize card_body rounded-4 text-center" responsive striped bordered hover>
                            <thead className="align-content-center thead-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Total Slots</th>
                                </tr>
                            </thead>
                            <tbody className="bg-light">
                                {Object.keys(allLocations).map((key, index) => {
                                return <tr key={allLocations[key].locationId}>
                                        <td>{index + 1}</td>
                                        <td>{allLocations[key].locationName}</td>
                                        <td>{allLocations[key].slots}</td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </div>}
            </div>
        </div>
    )
}

export default ViewLocations
