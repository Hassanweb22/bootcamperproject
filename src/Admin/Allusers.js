import React, { useState, useEffect } from 'react'
import { Table } from "react-bootstrap"
import firebase from "../Components/firebase/index"
import Block from "./RemoveUser"


function AllBookings() {
    const [allUsers, setAllUsers] = useState({})
    const [currentUser, setcurrentUser] = useState({})

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                setcurrentUser(user)
                // firebase.database().ref("admin/").child("users").on("value", snapshot => {
                //     console.log("Admin_AllBookings_FireBase", snapshot.val())
                //     if (snapshot.val() !== null) {
                //         setAllUsers(snapshot.val())
                //     }
                // })
                firebase.database().ref("clients/").on("value", snapshot => {
                    console.log("Admin_AllBookings_FireBase", snapshot.val())
                    if (snapshot.val() !== null) {
                        let allusers = Object.keys(snapshot.val()).filter(user => {
                            return snapshot.val()[user].username !== "admin"
                        }).map(user => {
                            return snapshot.val()[user]
                        })
                        console.log("except admin", allusers)
                        setAllUsers(allusers)
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
                            {allUsers.map(user => {
                                return <tr key={user.key}>
                                    {/* <td>{key}</td> */}
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td><Block item={user} block={user.block} id={user.key} size="sm" variant="danger" /></td>
                                </tr>
                            })}
                        </tbody>
                    </Table>}
            </div>
        </div >
    )
}

export default AllBookings;
