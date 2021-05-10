import React from 'react'
import { Button } from "react-bootstrap"
import firebase from "../Components/firebase/index"

function BlockUser({ item, block, size, variant }) {

    const blockUser = () => {
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
            <Button size={size} variant={variant} onClick={_ => blockUser()}>{block ? "Unblock" : "Block"}</Button>
        </div>
    )
}

export default BlockUser
