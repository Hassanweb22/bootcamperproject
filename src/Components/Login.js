import React, { useState, useEffect } from 'react'
import { Form, Button, Card } from "react-bootstrap"
import { useHistory } from 'react-router-dom'
import firebase from "../Components/firebase/index"
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
        setState(initialState)
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
                        <Button className="w-100" variant="primary" type="submit" disabled={!validate()}>Submit</Button>
                    </Form>
                </Card>
            </div>
        </div>
    )
}
