import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import Locations from '../Components/AddBooking/Locations';
import Login from "../Components/Login"
import SignUp from "../Components/Signup"
import forgetPassword from "../Components/forgetPassword"
import NewBookings from "../Components/AddBooking/NewBooking"
import Dashboard from "../Components/Dashboard"
import ShowBookings from '../Components/AddBooking/ShowBookings';
import AdminDashboard from '../Admin/Dashboard';
import Allusers from '../Admin/Allusers';
import AllBookings from '../Admin/AllBookings';
import AddLocations from '../Admin/AddLocations';
import ViewLocations from '../Admin/ViewLocations';
import firebase from "../Components/firebase/index"
import NavBar from '../Components/NavBar';
import PrivateRoutes from "./PrivateRoute"
// import LoginRoutes from "./LoginRoutes"
// import { useSelector, useDispatch } from "react-redux"

export default function Routes() {
    // const currentState = useSelector(state => state.task)
    const [admin, setAdmin] = useState({})
    const [loginUser, setLoginUser] = useState({})
    const [isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            if (!!user) {
                localStorage.setItem('loginUser', JSON.stringify(user));
                if (user?.email === "admin@gmail.com") {
                    setAdmin(user)
                }
                else {
                    setLoginUser(user)
                    setIsAuth(true)
                }
            }
            else {
                setIsAuth(false)
                setAdmin({})
                setLoginUser({})
            }
        })
        // console.log("currentState", JSON.parse(localStorage.getItem("loginUser")))
        return () => console.log("something has removed")
    }, [firebase.auth().currentUser])

    return (
        <Router>
            <NavBar />
            <Switch>
                <PrivateRoutes exact path="/" component={Login} redirectTo={!!Object.keys(admin).length ? "/adminDashboard" : "/dashboard"} isLogin />
                <PrivateRoutes exact path="/Signup" component={SignUp} redirectTo={!!Object.keys(admin).length ? "/adminDashboard" : "/dashboard"} isLogin />
                <PrivateRoutes exact path="/forget" component={forgetPassword} redirectTo={!!Object.keys(admin).length ? "/adminDashboard" : "/dashboard"} isLogin />

                <PrivateRoutes exact path="/allusers" component={Allusers} redirectTo="/" isUser={!Object.keys(admin).length} />
                <PrivateRoutes exact path="/allbookings" component={AllBookings} redirectTo="/" isUser={!Object.keys(admin).length} />
                <PrivateRoutes exact path="/adminDashboard" component={AdminDashboard} redirectTo="/" isUser={!Object.keys(admin).length} />
                <PrivateRoutes exact path="/viewlocations" component={ViewLocations} redirectTo="/" isUser={!Object.keys(admin).length} />
                <PrivateRoutes exact path="/addlocations" component={AddLocations} redirectTo="/" isUser={!Object.keys(admin).length} />


                <PrivateRoutes exact path="/dashboard" component={Dashboard} redirectTo="/" isAdmin={!!Object.keys(admin).length} />
                <PrivateRoutes exact path="/showbookings" component={ShowBookings} redirectTo="/" isAdmin={!!Object.keys(admin).length} />
                <PrivateRoutes exact path="/locations/:address/:totalSlots" component={NewBookings} redirectTo="/" isAdmin={!!Object.keys(admin).length} />
                <PrivateRoutes exact path="/locations" component={Locations} redirectTo="/" isAdmin={!!Object.keys(admin).length} />

            </Switch>
        </Router >
    )
}
