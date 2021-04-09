import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Navbar from '../Components/NavBar';
import AdminNavbar from '../Admin/NavBar';
import Login from "../Components/Login"
import SignUp from "../Components/Signup"
import forgetPassword from "../Components/forgetPassword"
import NewBookings from "../Components/AddBooking/NewBooking"
import Dashboard from "../Components/Dashboard"
import ShowBookings from '../Components/AddBooking/ShowBookings';
import AdminDashboard from '../Admin/Dashboard';
import Allusers from '../Admin/Allusers';
import AllBookings from '../Admin/AllBookings';
import firebase from "../Components/firebase/index"

export default function Routes() {

    const [admin, setAdmin] = useState({})
    const [loginUser, setLoginUser] = useState({})

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            // console.log("user", user)
            if (user?.email !== "admin@gmail.com") {
                setAdmin(user)
            }
            else {
                setLoginUser(user)
            }
        })
        // firebase.database().ref("clients/").on("value", snapshot => {
        //   console.log("NavBar FbDatabase", snapshot.val())
        // })

        return () => console.log("something has removed")
    }, [firebase.auth().currentUser])

    return (
        <Router>
            {(admin || loginUser) ? (admin?.email === "admin@gmail.com" > 0 ? <AdminNavbar /> : null) : null}
            {(admin || loginUser) ? (admin?.email !== "admin@gmail.com" > 0 ? <Navbar /> : null) : null}
            {/* {loginUser?.email !== "admin@gmail.com" > 0 ? <Navbar /> : null} */}
            {/* {Object.keys(loginUser).length > 0 ? <Navbar /> : null} */}
            <Switch>
                {/* <Route exact path="/" component={Home} /> */}
                <Route exact path="/" component={Login} />
                <Route path="/Signup" component={SignUp} />
                <Route path="/Dashboard" component={Dashboard} />
                <Route path="/forget" component={forgetPassword} />
                <Route path="/addbookings" component={NewBookings} />
                <Route path="/showbookings" component={ShowBookings} />
                <Route path="/allusers" component={Allusers} />
                <Route path="/allbookings" component={AllBookings} />
                <Route path="/adminDashboard" component={AdminDashboard} />
            </Switch>
        </Router >
    )
}
