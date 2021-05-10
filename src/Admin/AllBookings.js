import React, { useState, useEffect } from 'react'
import { Table, Spinner, Container, Form, Button } from "react-bootstrap"
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
    const [sorting, setSorting] = useState(false)
    const [allLocations, setAllLocations] = useState([])

    const { sort, address } = state

    useEffect(() => {
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                firebase.database().ref("clients/").on("value", snapshot => {
                    let newArray = []
                    Object.keys(snapshot.val()).map(user => {
                        if (snapshot.val()[user].hasOwnProperty('bookings') === true) {
                            return Object.keys(snapshot.val()[user]?.bookings).map(val => newArray.push(snapshot.val()[user]?.bookings[val]))
                        }
                    })
                    console.log({ newArray })
                    setnewArray(newArray)
                    setBookings(newArray)
                    let location = newArray.map(a => a.location).filter((v, i, a) => a.indexOf(v) === i);
                    setAllLocations(location)
                })
            } else {
                return false
            }
        });
        return () => false
    }, [])

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
    }

    const getDuration = (array) => {
        let day = array[0] > 0 ? `${array[0]} Day ` : ""
        let hour = array[1] > 0 ? `${array[1]} Hour ` : ""
        let min = array[2] > 0 ? `${array[2]} Mins ` : ""
        return day + hour + min
    }

    return (
        <div className="container my-5">
            <div className="users_heading">
                <h2 className="text-center text-capitalize" >All Users Bookings</h2>
                <p>{!sorting ? "to See Filters" : "to hide Filters"} <span onClick={_ => setSorting(!sorting)}>click here</span></p>
            </div>
            <div className="row">
                {newArray.length === 0 ?
                    <div className="text-center mx-auto">
                        <Spinner animation="border" size="lg" variant="primary" />
                    </div>
                    : <div className="col-lg-12 col-12 allBookings">
                        {sorting ?
                            <Container className="contrainer1">
                                <Form className="row" onSubmit={handleSubmit}>

                                    <Form.Group className="text-capitalize col-md-3 " controlId="exampleForm.ControlSelect1">
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
                            </Container> : null}
                        <div className="tableDiv">
                            <Table className="allBookings text-capitalize card_body rounded-4 text-center" responsive striped bordered hover>
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
                                        let duration = getDuration(user.timeDuration)

                                        return <tr key={user.bookingId}>
                                            <td>{index + 1}</td>
                                            <td>{user.location}</td>
                                            <td>{user.slots}</td>
                                            <td className="date">{user.userDate}</td>
                                            <td className="time">{startTime.format("h:mm a")}</td>
                                            <td className="date">{user.endDate}</td>
                                            <td className="time">{endTime.format("h:mm a")}</td>
                                            <td className="duration">{duration}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>}
            </div>
        </div >
    )
}

export default AllBookings;
