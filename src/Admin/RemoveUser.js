import React, { useState, useEffect } from 'react'
import { Button } from "react-bootstrap"
import firebase from "../Components/firebase/index"
// import { useParams } from "react-router-dom"

function BlockUser({ item, block, id, size, variant }) {
    let [user, setUser] = useState({})
    // let [block, setBlock] = useState(false)

    useEffect(() => {
        return () => {
            console.log("")
        }
    }, [])

    const Delete = () => {
        firebase.database().ref("clients/").child(id).on("value", snapshot => {
            setUser(snapshot.val())
        })
        console.log("Block user", item)
        let update = { block: !block, username: item.username, bookings: item.bookings, email: item.email, key: item.key }
        // console.log("Block user Update", update)
        firebase.database().ref('clients/').child(item.key).set(
            update,
            err => {
                if (err) {
                    console.log("error", err)
                }
            });
        // if (window.confirm("Are you sure You want To delete This User")) {
        // firebase.database().ref("admin/users").child(id).remove()
        // firebase.auth().de(id)
        //     .then(() => {
        //         console.log('Successfully deleted user');
        //     })
        //     .catch((error) => {
        //         console.log('Error deleting user:', error);
        //     });
        // }
    }


    return (
        <div>
            <Button size={size} variant={variant} onClick={_ => Delete()}>{block ? "Unblock" : "Block"}</Button>
        </div>
    )
}

export default BlockUser
