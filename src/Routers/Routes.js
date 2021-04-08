import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import NavBar from './components/NavBar';
// import Home from '../Components/Home'
import Navbar from '../Components/NavBar';
import Login from "../Components/Login"
import SignUp from "../Components/Signup"
import forgetPassword from "../Components/forgetPassword"
import NewBookings from "../Components/AddBooking/NewBooking"
import Dashboard from "../Components/Dashboard"
import ShowBookings from '../Components/AddBooking/ShowBookings';
import AdminDashboard from '../Admin/Dashboard';
import Allusers from '../Admin/Allusers';
import AllBookings from '../Admin/AllBookings';
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
                <Route path="/addbookings" component={NewBookings} />
                <Route path="/showbookings" component={ShowBookings} />
                <Route path="/allusers" component={Allusers} />
                <Route path="/allbookings" component={AllBookings} />
                <Route path="/adminDashboard" component={AdminDashboard} />
            </Switch>
        </Router >
    )
}
