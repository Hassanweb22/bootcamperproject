import React, { useState, useEffect } from 'react'
import { Table } from "react-bootstrap"
import firebase from "../Components/firebase/index"
import Remove from "./RemoveUser"


function AllBookings() {
    const [allUsers, setAllUsers] = useState({})
    const [currentUser, setcurrentUser] = useState({})

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                setcurrentUser(user)
                firebase.database().ref("admin/").child("users").on("value", snapshot => {
                    console.log("Admin_AllBookings_FireBase", snapshot.val())
                    if (snapshot.val() !== null) {
                        setAllUsers(snapshot.val())
                    }
                })
            } else {
                console.log("No user Found", user?.uid)
            }
        });
        return () => {
            console.log("AllUsers Unmounted")
        }
    }, [])
    console.log({ allUsers, currentUser })

    return (
        <div className="container my-5">
            <div className="users_heading">
                <h2 className="text-center text-capitalize" >All Users</h2>
            </div>
            <div className="row">
                {Object.keys(allUsers).length === 0 ?
                    <div className="text-center mx-auto">
                        <h2 className="no_bookings">No Users Yet</h2>
                    </div>
                    : <Table className="card_body text-capitalize text-center" responsive striped bordered hover>
                        <thead className="align-content-center thead-dark">
                            <tr className="text-capitalize">
                                {/* <th>Users ID</th> */}
                                <th>username</th>
                                <th>email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-light">
                            {Object.keys(allUsers).map(key => {
                                return <tr key={key}>
                                    {/* <td>{key}</td> */}
                                    <td>{allUsers[key].username}</td>
                                    <td>{allUsers[key].email}</td>
                                    <td><Remove item={allUsers[key]} id={key} size="sm" variant="danger" /></td>
                                </tr>
                            })}
                        </tbody>
                    </Table>}
            </div>
        </div >
    )
}

export default AllBookings;
