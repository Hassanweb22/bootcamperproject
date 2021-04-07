import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import NavBar from './components/NavBar';
// import Home from '../Components/Home'
import Navbar from '../Components/NavBar';
import Login from "../Components/Login"
import SignUp from "../Components/Signup"
import forgetPassword from "../Components/forgetPassword"
import AddBooking from "../Components/AddBooking/AddBooking"
import Dashboard from "../Components/Dashboard"
import ShowBookings from '../Components/AddBooking/ShowBookings';
// import firebase from "./firebase/fire"

export default function Routes() {

    return (
        <Router>
            <Navbar />
            <Switch>
                {/* <Route exact path="/" component={Home} /> */}
                <Route exact path="/" component={Login} />
                <Route path="/Signup" component={SignUp} />
                <Route path="/Dashboard" component={Dashboard} />
                <Route path="/forget" component={forgetPassword} />
                <Route path="/addbookings" component={AddBooking} />
                <Route path="/showbookings" component={ShowBookings} />
            </Switch>
        </Router >
    )
}
