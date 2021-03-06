import React, { useState, useEffect } from 'react'
import { Navbar, Nav, Form, Button } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import firebase from "../Components/firebase/index"
import "../Components/style.css"


export default function AdminNav() {
    let history = useHistory()

    const [admin, setAdmin] = useState({})

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (user?.email === "admin@gmail.com") {
                setAdmin(user)
            }
        })
        return () => ""
    }, [])

    const signOut = () => {
        firebase.auth().signOut()
        history.push("/")
    }

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
                <Navbar.Toggle className={`responsive-navbar-nav`} aria-controls="responsive-navbar-nav" />
                <Navbar.Brand style={{ cursor: "pointer" }}
                    onClick={() => history.push(!firebase.auth().currentUser ? "/" : "/admindashboard")}
                >Parking App</Navbar.Brand>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        {/* < Nav.Link onClick={() => history.push("./signup")}>SignUp</Nav.Link> */}
                        {!admin ?
                            < Nav.Link onClick={() => history.push("./signup")}>SignUp</Nav.Link>
                            :
                            <> <Nav.Link onClick={() => history.push("./admindashboard")}>Admin Dashboard</Nav.Link>
                                <Nav.Link onClick={() => history.push("./allusers")}>All Users</Nav.Link>
                                <Nav.Link onClick={() => history.push("./allbookings")}>All Bookings</Nav.Link>
                                <Nav.Link onClick={() => history.push("./addlocations")}>Add Locations</Nav.Link>
                                <Nav.Link onClick={() => history.push("./viewLocations")}>View Loations</Nav.Link>
                            </>}
                    </Nav>
                    <Form inline>
                        <span className="mt-2 mt-md-0 mt-lg-0">{admin ?
                            <Button className="btn btn-block" variant="info" size="" onClick={signOut}>Logout</Button>
                            : <Button className="btn btn-block" variant="info" size="" onClick={() => history.push("/signup")}>Sign Up</Button>}
                        </span>
                    </Form>
                </Navbar.Collapse>
            </Navbar>
        </div >
    )
}


