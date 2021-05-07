import React, { useState, useEffect } from 'react'
import { Button } from "react-bootstrap"
import firebase from "../Components/firebase/index"

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

        firebase.database().ref('clients/').child(item.key).update(
            {block: !block},
            err => {
                if (err) {
                    console.log("error", err)
                }
            });
    }


    return (
        <div>
            <Button size={size} variant={variant} onClick={_ => Delete()}>{block ? "Unblock" : "Block"}</Button>
        </div>
    )
}

export default BlockUser
