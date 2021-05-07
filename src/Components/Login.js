import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap"
import { Envelope, Eye, EyeSlash } from "react-bootstrap-icons"
import { useHistory, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import firebase from "../Components/firebase/index"
import "./style.css"

export default function Login() {
    let history = useHistory()
    let initialState = {
        email: "",
        password: "",
    }
    let initialErrors = {
        email: "",
        password: "",
        access: "",
        block: "",
        connection: ""
    }
    const [state, setState] = useState(initialState)
    const [showPassword, setShowPassword] = useState(true)
    const [loading, setLoading] = useState(false)
    const [validationError, setvalidationError] = useState(initialErrors)

    let { email, password } = state

    useEffect(() => {
        return () => console.log("Login Component unmounted")
    }, [])

    const handleChange = (e) => {
        let { name, value } = e.target
        setState({
            ...state,
            [name]: value,
        })
        setvalidationError(initialErrors)
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        setvalidationError(initialErrors)
        let ifBlock
        firebase.database().ref("clients/").on("value", snapshot => {
            Object.keys(snapshot.val()).filter(user => {
                if (snapshot.val()[user].email === state.email && snapshot.val()[user].block) {
                    ifBlock = snapshot.val()[user].email
                    setvalidationError({ ...validationError, block: "You have been Blocked" })
                }
            })
        })

        if (!ifBlock) {
            setvalidationError({ ...validationError, block: "" })
            setLoading(true)
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then(({ user }) => {
                    if (user.email === "admin@gmail.com") {
                        history.push("/adminDashboard")
                    }
                    else {
                        history.push("/dashboard")
                        console.log("Loginuser", user)
                    }
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
                        setvalidationError({ ...validationError, password: "Password is invalid" })
                    }
                    else if (error.code === "auth/too-many-requests") {
                        setvalidationError({ ...validationError, access: "Too many try, Now Access to this account has been disabled" })
                    }
                    else if (error.code === "auth/network-request-failed") {
                        setvalidationError({ ...validationError, connection: "Your Internet Connection has been disbaled" })
                    }
                    else {
                        setvalidationError(initialState)
                    }
                    setLoading(false)
                });
            setvalidationError({ ...validationError, block: "" })
        }

    }

    let validate = () => (state.email && state.password && !loading) ? true : false

    return (

        <div className="container mt-5">
            <div className="users_heading">
                <h2 className="text-center text-capitalize">Login</h2>
            </div>

            <div className="row">
                <Card className="card_body col-lg-8 col-sm-12 col-md-10 col-11 mx-auto py-3" style={{ width: '40rem' }}>
                    {(validationError?.access || validationError?.connection) ? <Alert className="" variant="danger">{validationError.access || validationError?.connection}</Alert> : null}
                    <Form className="mb-3" onSubmit={handleSubmit}>
                        <Form.Group className="input-group" controlId="formTitle">
                            <Form.Label className="d-block w-100">Email</Form.Label>
                            <Form.Control className={validationError.email ? "is-invalid" : ""} type="email" placeholder="Enter Email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                            />
                            <div className="input-group-text">
                                <Envelope />
                            </div>
                            <Form.Text className="text-danger ml-1 w-100">{validationError.email || validationError.block}</Form.Text>
                        </Form.Group>

                        <Form.Group className="input-group" controlId="formDescription">
                            <Form.Label className="d-block w-100">Password</Form.Label>
                            <Form.Control className={validationError.password ? "is-invalid" : ""} placeholder="Password"
                                type={showPassword ? "password" : "text"}
                                name="password"
                                value={password}
                                onChange={handleChange}
                            />
                            <div className="input-group-text">
                                {showPassword ? <Eye onClick={() => setShowPassword(false)} />
                                    : <EyeSlash onClick={() => setShowPassword(true)} />}
                            </div>
                            <Form.Text className="text-danger w-100">{validationError.password}</Form.Text>
                        </Form.Group>
                        <Button className="w-100" variant="primary" type="submit" disabled={!validate()}>
                            {loading ? <>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                <span className="ml-2">Loading...</span>
                            </> : "Submit"}
                        </Button>
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
