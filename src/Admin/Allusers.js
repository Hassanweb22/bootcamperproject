import React, { useState, useEffect } from 'react'
import { Table } from "react-bootstrap"
import firebase from "../Components/firebase/index"
import ActionsButton from "./ActionsButton"
import { blockUser, deleteUserData } from "../utils/index"
import SweetAlert from 'react-bootstrap-sweetalert';


function AllBookings() {
    const [allUsers, setAllUsers] = useState({})
    const [deleteUser, setDeleteUser] = useState({})

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                firebase.database().ref("clients/").on("value", snapshot => {
                    if (!!snapshot.val()) {
                        let allusers = Object.keys(snapshot.val()).filter(user => {
                            return snapshot.val()[user].username !== "admin"
                        }).map(user => {
                            return snapshot.val()[user]
                        })
                        // console.log("except admin", allusers)
                        setAllUsers(allusers)
                    }
                })
            }
        });

        return () => false
    }, []);


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
                    : <Table className="allUsers card_body text-center" responsive striped bordered hover>
                        <thead className="align-content-center thead-dark">
                            <tr className="text-capitalize">
                                <th>username</th>
                                <th>email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-light">
                            {allUsers.map(user => {
                                return (
                                    <tr key={user.key}>
                                        <td className="text-capitalize">{user.username}</td>
                                        <td>{user.email}</td>
                                        <td className="d-flex justify-content-around flex-wrap">
                                            <ActionsButton
                                                size="sm"
                                                variant="danger"
                                                title={user.block ? "Unblock" : "Block"}
                                                onClick={_ => blockUser(user, user.block)}
                                            />
                                            <ActionsButton
                                                size="sm"
                                                variant="danger"
                                                title="Delete"
                                                onClick={_ => setDeleteUser(user)}
                                            />
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </Table>}
            </div>
            {!!Object.keys(deleteUser).length && (
                <SweetAlert
                    warning
                    showCancel
                    confirmBtnText="Delete it!"
                    confirmBtnBsStyle="danger"
                    // title="Do you wanna Delete User?"
                    onConfirm={() => {
                        console.log("deleteUser", deleteUser)
                        setDeleteUser({});
                        deleteUserData(deleteUser) && setDeleteUser({});

                    }}
                    onCancel={() => {
                        setDeleteUser({});
                        return console.log("admin didn't delete user")
                    }}
                    allowEscape={false}
                >
                    Do you wanna Delete User?
                </SweetAlert>
            )}
        </div >
    )
}

export default AllBookings;
