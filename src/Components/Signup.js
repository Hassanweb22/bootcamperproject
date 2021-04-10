import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap"
import { useHistory, Link } from 'react-router-dom'
// import { X } from "react-bootstrap-icons"
import firebase from "../Components/firebase/index.js"
import "./style.css"


export default function SignUp() {
    // const history = useHistory()
    let initialState = {
        username: "",
        email: "",
        password: "",
    }
    const [state, setState] = useState(initialState)
    const [validationError, setvalidationError] = useState({
        email: "",
        password: "",
        username: ""
    })
    const [currentUser, setCurrentUser] = useState({})

    let { email, password, username } = state

    useEffect(() => {
        setCurrentUser(firebase.auth().currentUser)
        return () => console.log("SignUp Component unmounted")
    }, [])

    const handleChange = (e) => {
        let { name, value } = e.target
        setState({
            ...state,
            [name]: value,
        })
        setvalidationError({ ...validationError, email: "", password: "" })

    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // console.log("state", state)
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(({ user }) => {
                let obj = { username, email: user.email, key: user.uid, bookings: {} }
                let adminObj = { username, email: user.email, key: user.uid }
                console.log("Signupuser", user.uid)
                firebase.database().ref('clients/').child(user.uid).set(
                    obj,
                    err => {
                        if (err) {
                            console.log("error", err)
                        }
                    });
                firebase.database().ref('admin/').child("users/").child(user.uid).set(
                    obj,
                    err => {
                        if (err) {
                            console.log("error", err)
                        }
                    });
                console.log("SignUp-User", obj)
                firebase.auth().signOut()
                setState(initialState)
                setvalidationError(initialState)
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log({ errorCode, errorMessage })
                if (errorCode === "auth/email-already-in-use") {
                    setvalidationError({ ...validationError, email: "The Email is already been in use" })
                }
                else if (errorCode === "auth/weak-password") {
                    setvalidationError({ ...validationError, password: "Password Must be greater than 6" })
                }
            });
    }
    let validate = () => (username && email && password) ? true : false


    return (

        <div className="container my-5">
            <div className="users_heading">
                <h2 className="text-center text-capitalize">Sign Up</h2>
            </div>
            <div className="row show">
                <Card className="card_body col-lg-8 col-sm-12 col-md-10 col-11 mx-auto " style={{ width: '40rem' }}>

                    < Form className="my-3" onSubmit={handleSubmit}>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" placeholder="Enter Username"
                                name="username"
                                value={username}
                                onChange={handleChange}
                            />
                            <Form.Text className="text-danger">{validationError.usernmae}</Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control className={validationError.email ? "is-invalid" : ""} type="email" placeholder="Enter Email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                            />
                            <Form.Text className="text-danger">{validationError.email}</Form.Text>
                        </Form.Group>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control className={validationError.password ? "is-invalid" : ""} type="password" placeholder="Password"
                                name="password"
                                value={password}
                                onChange={handleChange}
                            />
                            <Form.Text className="text-danger">{validationError.password}</Form.Text>
                        </Form.Group>
                        <Button className="w-100" variant="primary" type="submit" disabled={!validate()}>Submit</Button>
                    </Form>
                    <hr />
                    <div className="text-center mb-4 d-flex justify-content-center">
                        <b>OR</b>
                        <Link to="/" className="mx-2 font-weight-bold">Login</Link>
                    </div>
                </Card>
            </div>
        </div >
    )
}
