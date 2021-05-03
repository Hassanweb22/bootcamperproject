import React, { useState, useEffect } from 'react'
import { Form, Button, Card, Alert, Spinner } from "react-bootstrap"
import { useHistory, Link } from 'react-router-dom'
import firebase from "../Components/firebase/index"
import "./style.css"

function AddLocations() {

    let history = useHistory()
    let initialState = {
        locationName: "",
        address: "",
        slots: 0
    }
    let initialErrors = {
        locationName: "",
        address: "",
    }
    const [state, setState] = useState(initialState)
    const [success, setSuccess] = useState(false)
    const [allLocations, setAllLocations] = useState({})
    const [validationError, setvalidationError] = useState(initialErrors)

    useEffect(() => {
        firebase.database().ref("admin").child("locations").on("value", snapshot => {
            // console.log("Firebase Locations", snapshot.val())
            setAllLocations(snapshot.val())
        })
        return () => console.log("")
    }, [])

    let { locationName, address, slots } = state

    const handleChange = (e) => {
        const { name, value } = e.target
        setState({
            ...state,
            [name]: value
        })
        setvalidationError(initialErrors)
    }
    const titleCase = str => {
        let str1 = str.toLowerCase()
        return str1.replace(/(^|\s)\S/g, function (t) { return t.toUpperCase() });
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let checkLocation = Object.keys(allLocations).find(key => {
            return allLocations[key].locationName === titleCase(locationName)
        })
        if (Object.keys(checkLocation ? checkLocation : []).length > 0) {
            console.log({ checkLocation })
            setvalidationError({ ...validationError, locationName: "This Location is Already Exists" })
        }
        else {
            const loc_key = firebase.database().ref("admin/").child("locations").push().key
            const obj = { locationId: loc_key, locationName: titleCase(locationName), slots }
            firebase.database().ref("admin/").child("locations").child(loc_key).set(
                obj,
                err => {
                    if (err) {
                        console.log("Location Error", err)
                    }
                }
            )
            setSuccess(true)
            setTimeout(() => {
                setSuccess(false)
            }, 4000);
            console.log("state", obj)
            setState(initialState)
        }
    }


    const validate = () => {
        return locationName && slots ? true : false
    }

    return (
        <div className="container mt-5">
            <div className="users_heading">
                <h2 className="text-center text-capitalize">Add Locations</h2>
            </div>

            <div className="row">
                <Card className="card_body col-lg-8 col-sm-12 col-md-10 col-11 mx-auto py-3" style={{ width: '40rem' }}>
                    {/* {(validationError?.access || validationError?.connection) ? <Alert className="" variant="danger">{validationError.access || validationError?.connection}</Alert> : null} */}
                    {success ? <Alert className="" variant="success">Location added Successfully</Alert> : null}
                    <Form className="mb-3" onSubmit={handleSubmit}>
                        <Form.Group controlId="formTitle">
                            <Form.Label className="ml-1">Location</Form.Label>
                            <Form.Control className="" type="text" placeholder="Enter Location Name"
                                name="locationName"
                                value={locationName}
                                onChange={handleChange}
                            />
                            <Form.Text className="text-danger ml-1">{validationError.locationName}</Form.Text>
                        </Form.Group>
                        <Form.Group controlId="exampleForm.ControlSelect1">
                            <Form.Label>No of Slots</Form.Label>
                            <Form.Control as="select" name="slots" value={slots} onChange={handleChange}>
                                <option value="">Select SLots</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                                <option value="7">7</option>
                            </Form.Control>
                        </Form.Group>

                        <Button className="w-100" variant="primary" type="submit" disabled={!validate()}>Submit</Button>
                    </Form>
                    {/* <hr /> */}
                    <div className="text-center mb-2 d-flex flex-column justify-content-center">
                        <b>OR</b>
                        <div>
                            <Link to="/viewLocations" className="mx-2">View Locations</Link>
                        </div>
                    </div>
                </Card>
            </div>
        </div >
    )
}

export default AddLocations
