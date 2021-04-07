import React, { useState, useEffect } from 'react'
import { Navbar, Nav, Form, Button } from "react-bootstrap"
import { useHistory } from "react-router-dom"
import firebase from "../Components/firebase/index"


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
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand style={{ cursor: "pointer" }}
          onClick={() => history.push(!firebase.auth().currentUser ? "/" : "/dashboard")}
        >Parking App</Navbar.Brand>
        <Nav className="mr-auto">
          {!loginUser ?
            < Nav.Link onClick={() => history.push("./signup")}>SignUp</Nav.Link>
            :
            <> <Nav.Link onClick={() => history.push("./dashboard")}>Dashbord</Nav.Link>
              <Nav.Link onClick={() => history.push("./addbookings")}>Add Booking</Nav.Link>
              <Nav.Link onClick={() => history.push("./showbookings")}>Show Booking</Nav.Link>
            </>
          }
        </Nav>
        <Form inline>
          <Form.Control type="text" placeholder="Search" className="mr-sm-2" />
          {/* <Button variant="info" size="" onClick={() => console.log("currentUser", firebase.auth().currentUser)}>user</Button> */}
          {loginUser ? <Button variant="info" size="" onClick={signOut}>Logout</Button> : null}
        </Form>
      </Navbar>
    </div >
  )
}


