import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Spinner } from "react-bootstrap"
import { Envelope, Eye, EyeSlash, Window } from "react-bootstrap-icons"
import { useHistory, Link } from 'react-router-dom'
import firebase from "../Components/firebase/index.js"
import { titleCase } from "../utils/index"
import "./style.css"


export default function SignUp() {

    const history = useHistory()
    let initialState = {
        username: "",
        email: "",
        password: "",
    }
    const [state, setState] = useState(initialState)
    const [showPassword, setShowPassword] = useState(true)
    const [validationError, setvalidationError] = useState({
        email: "",
        password: "",
        username: ""
    })
    const [currentUser, setCurrentUser] = useState({})
    const [loading, setLoading] = useState(false)


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
        setLoading(true)
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then(({ user }) => {
                let obj = { username: titleCase(username), email: user.email, key: user.uid, bookings: {} }
                firebase.database().ref('clients/').child(user.uid).set(
                    obj,
                    err => {
                        if (err) {
                            console.log("error", err)
                        }
                    });
                console.log("SignUp-User", obj)
                setState(initialState)
                setvalidationError(initialState)
                // firebase.auth().signOut()
                history.push("/")
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log({ errorCode, errorMessage })
                if (errorCode === "auth/email-already-in-use") {
                    setvalidationError({ ...validationError, email: "The Email is already been in use" })
                }
                else if (errorCode === "auth/weak-password") {
                    setvalidationError({ ...validationError, password: "Password should be at least 6 characters" })
                }
                setLoading(false)
            });
    }



    let validate = () => (username && email && password && !loading) ? true : false


    return (

        <div className="container my-5">
            <div className="users_heading">
                <h2 className="text-center text-capitalize">Sign Up</h2>
            </div>
            <div className="row show">
                <Card className="card_body col-lg-8 col-sm-12 col-md-10 col-11 mx-auto " style={{ width: '40rem' }}>

                    <Form className="my-3" onSubmit={handleSubmit}>

                        <Form.Group className="input-group" controlId="formUsername">
                            <Form.Label className="d-block w-100">Username</Form.Label>
                            <Form.Control className="text-secondary" type="text" placeholder="Enter Username"
                                name="username"
                                value={username}
                                onChange={handleChange}
                            />
                            <div className="input-group-text">
                                <Window />
                            </div>
                            <Form.Text className="text-danger w-100">{validationError.usernmae}</Form.Text>
                        </Form.Group>

                        <Form.Group className="input-group" controlId="formEmail">
                            <Form.Label className="d-block w-100">Email</Form.Label>
                            <Form.Control className={`${validationError.email ? "is-invalid" : ""} text-secondary`} type="email" placeholder="Enter Email"
                                name="email"
                                value={email}
                                onChange={handleChange}
                            />
                            <div className="input-group-text">
                                <Envelope />
                            </div>
                            <Form.Text className="text-danger w-100">{validationError.email}</Form.Text>
                        </Form.Group>

                        <Form.Group className="input-group" controlId="formPassword">
                            <Form.Label className="d-block w-100">Password</Form.Label>
                            <Form.Control className={`${validationError.password ? "is-invalid" : ""} text-secondary`} placeholder="Password"
                                type={showPassword ? "password" : "text"}
                                name="password"
                                value={password}
                                onChange={handleChange}
                            />
                            <div className="input-group-text">
                                {showPassword ? <EyeSlash onClick={() => setShowPassword(false)} />
                                    : <Eye onClick={() => setShowPassword(true)} />}
                            </div>
                            {/* <Form.Text className="text-dark">Password Must be greater than 5</Form.Text> */}
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
