import React, { useState, useEffect } from 'react'
import { Form, Button, Card } from "react-bootstrap"
import { useHistory } from 'react-router-dom'
import firebase from "../Components/firebase/index"
import { Link } from "react-router-dom"
// import "./style.css"

export default function Login() {
    let history = useHistory()
    let initialState = {
        email: ""
    }
    const [state, setState] = useState(initialState)

    let { email } = state

    useEffect(() => {
        console.log("Forget Password")
    }, [])

    const handleChange = (e) => {
        let { name, value } = e.target
        setState({
            ...state,
            [name]: value,
        })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("state", state)
        firebase.auth().sendPasswordResetEmail(email)
            .then(() => {
                window.alert("Email has been sent to you please check it!!")
                setState(initialState)
            })
            .catch((error) => {
                let errorCode = error.code
                let errorMessage = error.message;

                console.log(errorCode)
                console.log(errorMessage)
                window.alert("Message", errorMessage)
            })
    }

    let validate = () => (state.email) ? true : false

    return (

        <div className="container mt-5">
            <h2 className="text-center text-capitalize main_heading mt-3">Forget Password</h2>
            <div className="row">
                <Card className="card_body col-lg-8 col-sm-12 col-md-10 col-11 mx-auto" style={{ width: '40rem' }}>
                    <Form className="my-3" onSubmit={handleSubmit}>

                        <Form.Group controlId="formTitle">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter Email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button className="w-100" variant="primary" type="submit" disabled={!validate()}>Submit</Button>
                    </Form>
                </Card>
            </div>
        </div >
    )
}
