import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap"
import { Envelope, Eye, EyeSlash, Google as GoogleIcon } from "react-bootstrap-icons"
import { useHistory, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import firebase, { googleProvider } from "../Components/firebase/index"
import { titleCase, errorsAtLogin, checkUserBlock } from "../utils/index"
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

        const ifBlock = checkUserBlock(state.email, setvalidationError, validationError)

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
                    }
                    setState(initialState)
                    setvalidationError(initialState)
                })
                .catch((error) => {
                    errorsAtLogin(error, setvalidationError, validationError, initialState)
                    setLoading(false)
                });
        }

    }

    const handleSocialLogin = async () => {
        setState(initialState)
        try {
            const googleSignIn = await firebase.auth().signInWithPopup(googleProvider)
            const { additionalUserInfo: { isNewUser }, user: { displayName, email, uid } } = googleSignIn
            console.log("googleSignIn", googleSignIn)

            if (isNewUser) {
                let obj = { username: titleCase(displayName), email: email, key: uid, bookings: {} }
                return firebase.database().ref('clients/').child(uid).set(obj, err => console.log("error", err));
            }
            else {
                const ifBlock = checkUserBlock(email, setvalidationError, validationError, true)
                if (ifBlock) {
                    firebase.auth().signOut()
                }
                else {
                    setvalidationError({ ...validationError, block: "" })
                    setLoading(true)
                    setState(initialState)
                    setvalidationError(initialState)
                    history.push("/dashboard")
                }
            }

            setLoading(false)

        } catch (error) {
            errorsAtLogin(error, setvalidationError, validationError, initialState, true)
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
                        <Button
                            className="w-100 mt-4"
                            type="submit"
                            style={{ fontWeight: "bold", background: "#e13719", borderColor: "#e13719" }}
                            onClick={handleSocialLogin}
                        >
                            <GoogleIcon color="white" size={35} className="p-2" />
                            Sign in with Google
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
