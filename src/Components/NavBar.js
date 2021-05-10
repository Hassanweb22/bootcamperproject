import React, { useState, useEffect } from 'react'
import { Navbar, Nav, Form, Button } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import firebase from "../Components/firebase/index"
import parkingApp from "../parking.png"
import "./style.css"


export default function NavBar() {
  let history = useHistory()

  const [loginUser, setloginUser] = useState({})
  const [admin, setAdmin] = useState({})

  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!!user) {
        if (user?.email === "admin@gmail.com") {
          setAdmin(user)
        }
        else {
          setloginUser(user)
        }
      }
      else {
        setAdmin({})
        setloginUser({})
      }
    })
    return () => console.log("")
  }, [])

  const adminNav = (Object.keys(admin).length) ?
    <>
      <Nav.Link onClick={() => history.push("/allusers")}>All Users</Nav.Link>
      <Nav.Link onClick={() => history.push("/allbookings")}>All Bookings</Nav.Link>
      <Nav.Link onClick={() => history.push("/addLocations")}>Add Locations</Nav.Link>
      <Nav.Link onClick={() => history.push("/viewLocations")}>View Loations</Nav.Link>
    </> : null

  const loginNav = (Object.keys(loginUser).length) ?
    <>
      <Nav.Link onClick={() => history.push("/locations")}>Locations</Nav.Link>
      <Nav.Link onClick={() => history.push("/showbookings")}>My Bookings</Nav.Link>
    </> : null

  const pushTo = !!Object.keys(admin).length ? "/admindashboard" : "/dashboard"
  const logoNav =
    <Navbar.Brand style={{ cursor: "pointer" }}
      onClick={() => history.push(!firebase.auth().currentUser ? "/" : pushTo)}>
      <img src={parkingApp} className="logo" />
    </Navbar.Brand>

  const signOut = () => {
    firebase.auth().signOut()
    localStorage.removeItem("loginUser")
    window.location.reload()
    console.log("LogOut")
  }

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle className={`responsive-navbar-nav`} aria-controls="responsive-navbar-nav" />
        {logoNav}
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="navbarLinks  mr-auto">
            {!!Object.keys(admin).length ?
              adminNav
              : !!Object.keys(loginUser).length ? loginNav : null
            }
          </Nav>

          <Form inline>
            <span className="mt-2 mt-md-0 mt-lg-0">{!!Object.keys(loginUser).length || !!Object.keys(admin).length ?
              <Button className="btn btn-block" variant="info" size="" onClick={signOut}>Logout</Button>
              : <Button className="btn btn-block" variant="info" size="" onClick={() => history.push("/signup")}>Sign Up</Button>}
            </span>
          </Form>

        </Navbar.Collapse>
      </Navbar>
    </div >
  )
}
