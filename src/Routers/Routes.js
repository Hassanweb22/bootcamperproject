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
// import PrivateRoutes from "./PrivateRoute"
// import LoginRoutes from "./LoginRoutes"
// import { useSelector, useDispatch } from "react-redux"

export default function Routes() {
    // const currentState = useSelector(state => state.task)
    const [admin, setAdmin] = useState({})
    const [loginUser, setLoginUser] = useState({})
    const [isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            // console.log("user", user)
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
        console.log("currentState", JSON.parse(localStorage.getItem("loginUser")))
        return () => console.log("something has removed")
    }, [firebase.auth().currentUser])


    return (
        <Router>
            <NavBar />
            <Switch>
                <Route exact path="/" component={Login} />
                {!admin?.email && !loginUser?.email ?
                    <>  <Route exact path="/" component={Login} />
                        <Route exact path="/Signup" component={SignUp} />
                        <Route exact path="/forget" component={forgetPassword} />
                    </>
                    : null
                }
                {Object.keys(admin).length > 0 ?
                    <>
                        <Route exact path="/allusers" component={Allusers} />
                        <Route exact path="/allbookings" component={AllBookings} />
                        <Route exact path="/adminDashboard" component={AdminDashboard} />
                        <Route exact path="/viewlocations" component={ViewLocations} />
                        <Route exact path="/addlocations" component={AddLocations} />
                    </>
                    : <Route exact path="/notfound" render={() => <h1>Not Found</h1>} />
                }
                {Object.keys(loginUser).length > 0 ?
                    <>
                        <Route exact path="/dashboard" component={Dashboard} />
                        <Route exact path="/showbookings" component={ShowBookings} />
                        <Route exact path="/locations/:address/:totalSlots" component={NewBookings} />
                        <Route exact path="/locations" component={Locations} />
                    </>
                    : null}
            </Switch>
        </Router >
    )
}
