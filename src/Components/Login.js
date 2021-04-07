import React, { useState, useEffect } from 'react'
import { Form, Button, Card } from "react-bootstrap"
import { useHistory } from 'react-router-dom'
import firebase from "../Components/firebase/index"
import { Link } from "react-router-dom"
// import "./style.css"

export default function Login() {
    let history = useHistory()
    let initialState = {
        email: "",
        password: "",
    }
    const [state, setState] = useState(initialState)
    const [error, setError] = useState("")

    let { email, password } = state

    useEffect(() => {
        console.log("isUserLogedIn", firebase.auth().currentUser)
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
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                // var userInfo = userCredential.user;
                history.push("./dashboard")
                console.log("Loginuser", user)
                setState(initialState)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
                    // setError(error.message)
                    window.alert(errorCode + "/n" + errorMessage)
                }
            });
    }

    let validate = () => (state.email && state.password) ? true : false

    return (

        <div className="container mt-5">
            <h2 className="text-center text-capitalize main_heading mt-3">Login</h2>
            <div className="row">
                <Card className="card_body col-lg-8 col-sm-12 col-md-10 col-11 mx-auto " style={{ width: '40rem' }}>
                    <Form className="my-3" onSubmit={handleSubmit}>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Enter Email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" placeholder="Password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <hr />
                        <div className="text-center mb-2 d-flex justify-content-center">
                            <Link to="./signup" className="mx-2">Create Account</Link>
                            <span>|</span>
                            <Link to="./forget" className="mx-2">Forget Password</Link>
                        </div>
                        <Button className="w-100" variant="primary" type="submit" disabled={!validate()}>Submit</Button>
                    </Form>
                </Card>
            </div>
        </div >
    )
}
