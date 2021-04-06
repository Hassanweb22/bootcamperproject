import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
// import NavBar from './components/NavBar';
// import Home from '../Components/Home'
import Navbar from '../Components/NavBar';
import Login from "../Components/Login"
import SignUp from "../Components/Signup"
import Dashboard from "../Components/Dashboard"
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
            </Switch>
        </Router >
    )
}
