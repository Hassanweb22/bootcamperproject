import React, { useState, useEffect } from 'react'
import { Navbar, Nav, Form, Button } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import firebase from "../Components/firebase/index"
import "./style.css"


export default function NavBar() {
  let history = useHistory()

  const [loginUser, setloginUser] = useState({})

  useEffect(() => {
    console.log("NavBar");
    firebase.auth().onAuthStateChanged((user) => {
      // console.log("user", user)
      setloginUser(user)
    })
    return () => console.log("navBar has removed")
  }, [])

  const adminNav = (loginUser?.email === "admin@gmail.com") ?
    <> <Nav.Link onClick={() => history.push("/admindashboard")}>Admin Dashboard</Nav.Link>
      <Nav.Link onClick={() => history.push("/allusers")}>All Users</Nav.Link>
      <Nav.Link onClick={() => history.push("/allbookings")}>All Bookings</Nav.Link>
    </> :
    <> <Nav.Link onClick={() => history.push("/dashboard")}>User Dashboard</Nav.Link>
      <Nav.Link onClick={() => history.push("/showbookings")}>Show Bookings</Nav.Link>
      <Nav.Link onClick={() => history.push("/locations")}>Locations</Nav.Link>
    </>

  const logoNav = (loginUser?.email === "admin@gmail.com") ?
    <Navbar.Brand style={{ cursor: "pointer" }}
      onClick={() => history.push(!firebase.auth().currentUser ? "/" : "/admindashboard")}>Parking App
    </Navbar.Brand>
    : <Navbar.Brand style={{ cursor: "pointer" }}
      onClick={() => history.push(!firebase.auth().currentUser ? "/" : "/dashboard")}>Parking App
      </Navbar.Brand>

  const signOut = () => {
    firebase.auth().signOut()
    history.push("/")
    console.log("LogOut")
  }
  // console.log("setuser", state.email)

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle className={`responsive-navbar-nav`} aria-controls="responsive-navbar-nav" />
        {logoNav}
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {!loginUser ?
              < Nav.Link onClick={() => history.push("/signup")}>SignUp</Nav.Link>
              :
              adminNav
            }
          </Nav>
          <Form inline>
            <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
            {/* <Button variant="info" size="" onClick={() => console.log("currentUser", firebase.auth().currentUser)}>user</Button> */}
            <span className="mt-2 mt-md-0 mt-lg-0">{loginUser ?
              <Button className="btn btn-block" variant="info" size="" onClick={signOut}>Logout</Button>
              : <Button className="btn btn-block" variant="info" size="" onClick={() => history.push("/signup")}>Sign Up</Button>}
            </span>
          </Form>
        </Navbar.Collapse>
      </Navbar>
    </div >
  )
}
