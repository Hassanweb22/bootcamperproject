import React, { useState, useEffect } from 'react'
import { Button } from "react-bootstrap"
import firebase from "../Components/firebase/index"
// import { useParams } from "react-router-dom"

function RemoveUser({ item, id, size, variant }) {
    useEffect(() => {

        return () => {

        }
    }, [])

    const Delete = () => {
        console.log("Delete Key", item)
        if (window.confirm("Are you sure You want To delete This User")) {
            firebase.database().ref("admin/users").child(id).remove()
            firebase.database().ref("clients/").child(id).remove()
            // firebase.auth().de(id)
            //     .then(() => {
            //         console.log('Successfully deleted user');
            //     })
            //     .catch((error) => {
            //         console.log('Error deleting user:', error);
            //     });
        }
    }


    return (
        <div>
            <Button size={size} variant={variant} onClick={_ => Delete()}>Remove</Button>
        </div>
    )
}

export default RemoveUser
