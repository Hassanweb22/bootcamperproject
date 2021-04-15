import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Alert } from "react-bootstrap"
import { useHistory, Link } from 'react-router-dom'
import firebase from "../Components/firebase/index"
import "./style.css"

export default function Login() {
    let history = useHistory()
    let initialState = {
        email: "",
        password: "",
    }
    const [state, setState] = useState(initialState)
    const [validationError, setvalidationError] = useState({
        email: "",
        password: "",
        access: "",
        block: ""
    })

    let { email, password } = state

    useEffect(() => {
        // console.log("isUserLogedIn", firebase.auth().currentUser)
        // firebase.database().ref("clients").orderByChild("email").on("value", snapshot => {
        //     console.log("clients", snapshot.val())
        // })
        return () => console.log("Login Component unmounted")
    }, [])

    const handleChange = (e) => {
        let { name, value } = e.target
        setState({
            ...state,
            [name]: value,
        })
        setvalidationError({ ...validationError, email: "", password: "", block: "", access: "" })
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        console.log("state", state)
        setvalidationError(initialState)
        firebase.auth().signInWithEmailAndPassword(email, password)
            .then(({ user }) => {
                // var userInfo = userCredential.user;
                if (user.email === "admin@gmail.com") {
                    history.push("/adminDashboard")
                }
                else {
                    firebase.database().ref("clients/").child(user.uid).once("value", snapshot => {
                        if (snapshot.val() !== null) {
                            if (!snapshot.val().block) {
                                console.log("clients", snapshot.val()[user.uid])
                                history.push("/dashboard")
                            }
                            else {
                                alert("You have been Blocked")
                                firebase.auth().signOut()
                                history.push("/")

                            }
                        }
                    })
                }
                console.log("Loginuser", user)
                setState(initialState)
                setvalidationError(initialState)
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log({ errorCode, errorMessage })
                if (error.code === "auth/user-not-found") {
                    setvalidationError({ ...validationError, email: "User have not found or may Have deleted" })
                    // window.alert(errorCode + "/n" + errorMessage)
                }
                else if (error.code === "auth/wrong-password") {
                    setvalidationError({ ...validationError, password: "Password May not be Correct" })
                }
                else if (error.code === "auth/too-many-requests") {
                    setvalidationError({ ...validationError, access: "Too many try, Now Access to this account has disabled" })
                }
                else {
                    setvalidationError(initialState)
                }
            });
    }

    let validate = () => (state.email && state.password) ? true : false

    return (

        <div className="container mt-5">
            <div className="users_heading">
                <h2 className="text-center text-capitalize">Login</h2>
            </div>

            <div className="row">
                <Card className="card_body col-lg-8 col-sm-12 col-md-10 col-11 mx-auto py-3" style={{ width: '40rem' }}>
                    {(validationError?.access) ? <Alert className="mt-3" variant={"danger"}>{validationError.access}</Alert> : null}
                    <Form className="mb-3" onSubmit={handleSubmit}>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Email</Form.Label>
                            <Form.Control className={validationError.email ? "is-invalid" : ""} type="email" placeholder="Enter Email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                            />
                            <Form.Text className="text-danger">{validationError.email}</Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formDescription">
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
                    {/* <hr /> */}
                    <div className="text-center mb-2 d-flex flex-column justify-content-center">
                        <b>OR</b>
                        <div>
                            <Link to="./signup" className="mx-2">Create Account</Link>
                            <span>|</span>
                            <Link to="./forget" className="mx-2">Forget Password</Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div >
    )
}
