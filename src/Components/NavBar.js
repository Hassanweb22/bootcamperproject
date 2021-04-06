import React, { useState, useEffect } from 'react'
import { Navbar, Nav, Form, Button } from "react-bootstrap"
import { useHistory } from "react-router-dom"
// import firebase from "../Components/firebase/index"


export default function NavBar() {
  let history = useHistory()

  const [state, setstate] = useState({})

  useEffect(() => {
    console.log("NavBar");
  }, [])

  const signOut = () => {
    // firebase.auth().signOut()
    history.push("./")
    console.log("LogOut")
  }
  // console.log("setuser", state.email)

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand style={{ cursor: "pointer" }}
          onClick={() => history.push("./")}
        >React Todoapp</Navbar.Brand>
        <Nav className="mr-auto">
          <>
            < Nav.Link onClick={() => history.push("./signup")}>Signup</Nav.Link>
          </>
            <Nav.Link onClick={() => history.push("./dashboard")}>Dashbord</Nav.Link>}
        </Nav>
        <Form inline>
          {/* <Form.Control type="text" placeholder="Search" className="mr-sm-2" /> */}
          {/* <Button variant="outline-info" onClick={() => console.log("setuser", firebase.auth().currentUser)}> user</Button> */}
          <Button variant="info" size="" onClick={signOut}>Logout</Button> 
        </Form>
      </Navbar>
    </div >
  )
}


