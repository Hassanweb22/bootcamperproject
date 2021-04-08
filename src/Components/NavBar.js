import React, { useState, useEffect } from 'react'
import { Navbar, Nav, Form, Button } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import firebase from "../Components/firebase/index"
import "./style.css"


export default function NavBar() {
  let history = useHistory()

  const [state, setstate] = useState({})
  const [loginUser, setloginUser] = useState({})

  useEffect(() => {
    console.log("NavBar");
    firebase.auth().onAuthStateChanged((user) => {
      console.log("user", user)
      setloginUser(user)
    })
    return () => console.log("soomething has removed")
  }, [])

  const signOut = () => {
    firebase.auth().signOut()
    history.push("./")
    console.log("LogOut")
  }
  // console.log("setuser", state.email)

  return (
    <div>
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Navbar.Toggle className={`responsive-navbar-nav`} aria-controls="responsive-navbar-nav" />
        <Navbar.Brand style={{ cursor: "pointer" }}
          onClick={() => history.push(!firebase.auth().currentUser ? "/" : "/dashboard")}
        >Parking App</Navbar.Brand>
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="mr-auto">
            {!loginUser ?
              < Nav.Link onClick={() => history.push("./signup")}>SignUp</Nav.Link>
              :
              <> <Nav.Link onClick={() => history.push(loginUser.email === "admin@gmail.com" ? "./admindashboard" : "/dashboard")}>{loginUser.email === "admin@gmail.com" ? "Admin Dashboard" : "User Dashboard"}</Nav.Link>
                <Nav.Link onClick={() => history.push(loginUser.email === "admin@gmail.com" ? "./allbookings" : "/addbookings")}>{loginUser.email === "admin@gmail.com" ? "All Bookings" : "Add Bookings"}</Nav.Link>
                <Nav.Link onClick={() => history.push("./showbookings")}>{loginUser.email === "admin@gmail.com" ? "All Bookings" : "Add Bookings"}</Nav.Link>
              </>
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


