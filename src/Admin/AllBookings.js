import React, { useState, useEffect } from 'react'
import { Table, Spinner, Container, Row, Form, Button } from "react-bootstrap"
import firebase from "../Components/firebase/index"
import moment from "moment"
import './style.css';


function AllBookings() {
    const initialState = {
        sort: "",
        address: ""
    }
    const [state, setState] = useState(initialState)
    const [bookings, setBookings] = useState([])
    const [newArray, setnewArray] = useState([])
    const [allLocations, setAllLocations] = useState([])

    const { sort, address } = state

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                firebase.database().ref("clients/").on("value", snapshot => {
                    let newArray = []
                    // console.log("AllBookings userData FireBase", snapshot.val())
                    Object.keys(snapshot.val()).map(user => {
                        if (snapshot.val()[user].hasOwnProperty('bookings') === true) {
                            return Object.keys(snapshot.val()[user]?.bookings).map(val => newArray.push(snapshot.val()[user]?.bookings[val]))
                        }
                    })
                    // newArray = newArray.sort((a, b) => (moment(b.userDate).format('YYYYMMDD') - moment(a.userDate).format('YYYYMMDD')))
                    setnewArray(newArray)
                    setBookings(newArray)
                    let location = newArray.map(a => a.location).filter((v, i, a) => a.indexOf(v) === i);
                    setAllLocations(location)
                })
            } else {
                return false
            }
            // firebase.database().ref("admin").child("locations").on("value", snapshot => {
            //     // console.log("Firebase Locations", snapshot.val())
            //     setAllLocations(snapshot.val())
            // })
        });
        return () => {
            console.log("AllBooking Unmounted")
        }
    }, [])
    console.log({ newArray })

    const dateTime = () => {
        let array = [...newArray];
        array = array.sort((a, b) => {
            return new Date(b.userDate).getTime() - new Date(a.userDate).getTime()
        });
        array = array.sort((a, b) => {
            if (new Date(a.userDate).getTime() === new Date(b.userDate).getTime()) {
                if (Number(b.startTime.split(":")[0]) < Number(a.startTime.split(":")[0])) {
                    return 1
                }
                else if (Number(b.startTime.split(":")[0]) === Number(a.startTime.split(":")[0])) {
                    if (Number(b.startTime.split(":")[1]) < Number(a.startTime.split(":")[1])) {
                        return 1
                    }
                }
                else {
                    return -1
                }
            }
            else {
                return 0
            }
        });

        setnewArray(array)
    }

    const sortBy = () => {
        if (sort === "datetime") {
            dateTime()
        }
        else if (sort === "date") {
            let array = [...newArray]
            // array = array.sort((a, b) => (moment(b.userDate).format('YYYYMMDD') - moment(a.userDate).format('YYYYMMDD')))
            array = array.sort((a, b) => {
                return new Date(b.userDate).getTime() - new Date(a.userDate).getTime()
            });
            setnewArray(array)
        }
        else if (sort === "slot") {
            let array = [...newArray]
            array.sort((a, b) => a.slots - b.slots)
            setnewArray(array)
        }
        else {
            setnewArray(bookings)
        }
    }

    const filterBy = () => {
        if (address) {
            if (address == "all") {
                let array = [...bookings]
                // array = array.sort((a, b) => (moment(b.userDate).format('YYYY-MM-DD') - moment(a.userDate).format('YYYY-MM-DD')))
                setnewArray(array)
            }
            else {
                let array = [...bookings]
                array = array.sort((a, b) => {
                    return new Date(b.userDate).getTime() - new Date(a.userDate).getTime()
                });
                array = array.sort((a, b) => {
                    if (new Date(a.userDate).getTime() === new Date(b.userDate).getTime()) {
                        if (Number(b.startTime.split(":")[0]) < Number(a.startTime.split(":")[0])) {
                            return 1
                        } else {
                            return -1
                        }
                    }
                    else {
                        return 0
                    }
                });
                array = array.filter(data => data.location == address)
                console.log("arrayFilter", array)
                setnewArray(array)
            }
        }
        else {
            setnewArray(bookings)
        }
        // console.log({ address })
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setState({
            ...state,
            [name]: value
        })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        sortBy()
        // console.log({ address, sort})
    }

    return (
        <div className="container my-5">
            <div className="users_heading">
                <h2 className="text-center text-capitalize" >All Users Bookings</h2>
            </div>
            <div className="row">
                {newArray.length === 0 ?
                    <div className="text-center mx-auto">
                        <Spinner animation="border" size="lg" variant="primary" />
                    </div>
                    : <div className="col-lg-12 col-12 allBookings">
                        <Container>
                            <Form className="row" onSubmit={handleSubmit}>
                                <Form.Group className="text-capitalize col-md-3 " controlId="exampleForm.ControlSelect1">
                                    {/* <Form.Label>Sorting</Form.Label> */}
                                    <Form.Control as="select" name="address"
                                        value={address}
                                        onChange={(e) => handleChange(e)}>
                                        <option value="">Select Location</option>
                                        <option value="all">All Locations</option>
                                        {allLocations.map(loc => {
                                            return <option key={loc} value={loc}>{loc}</option>
                                        })}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="col-md-3">
                                    <Button className="w-100" variant="primary"
                                        disabled={!address}
                                        onClick={() => filterBy()}>Filter</Button>
                                </Form.Group>
                                <Form.Group className="text-capitalize col-md-3 " controlId="exampleForm.ControlSelect1">
                                    {/* <Form.Label>Sorting</Form.Label> */}
                                    <Form.Control as="select" name="sort"
                                        value={sort}
                                        onChange={(e) => handleChange(e)}>
                                        <option value="">Select Sort</option>
                                        <option value="date">by Date</option>
                                        <option value="datetime">by Date Time</option>
                                        <option value="slot">by slot</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group className="col-md-3">
                                    <Button className="w-100" variant="primary" type="submit">Sort</Button>
                                </Form.Group>
                            </Form>
                        </Container>

                        <Table size={window.innerWidth < 500 ? "sm" : "md"} className="text-capitalize card_body rounded-4 text-center" responsive striped bordered hover>
                            <thead className="align-content-center thead-dark">
                                <tr>
                                    <th>#</th>
                                    <th>location</th>
                                    <th>slot no</th>
                                    <th>Start Date</th>
                                    <th>Start Time</th>
                                    <th>End Date</th>
                                    <th>End Time</th>
                                    <th>Time Duration</th>
                                </tr>
                            </thead>
                            <tbody className="bg-light">
                                {newArray.map((user, index) => {
                                    let startTime = moment(user.userDate + " " + user.startTime)
                                    let endTime = moment(user.endDate + " " + user.endTime)
                                    let duration = `${user.timeDuration[0]}D/${user.timeDuration[1]}H/${user.timeDuration[2]}M`

                                    return <tr key={user.bookingId}>
                                        <td>{index + 1}</td>
                                        <td>{user.location}</td>
                                        <td>{user.slots}</td>
                                        <td>{user.userDate}</td>
                                        <td>{startTime.format("h:mm a")}</td>
                                        <td>{user.endDate}</td>
                                        <td>{endTime.format("h:mm a")}</td>
                                        <td>{duration}</td>
                                    </tr>
                                })}
                            </tbody>
                        </Table>
                    </div>}
            </div>
        </div >
    )
}

export default AllBookings;
