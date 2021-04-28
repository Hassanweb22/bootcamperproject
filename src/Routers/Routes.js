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
import LoginRoutes from "./LoginRoutes"
import { useSelector, useDispatch } from "react-redux"

export default function Routes() {
    // const currentState = useSelector(state => state.task)
    const [admin, setAdmin] = useState({})
    const [loginUser, setLoginUser] = useState({})
    const [isAuth, setIsAuth] = useState(false)

    useEffect(() => {
        firebase.auth().onAuthStateChanged((user) => {
            // console.log("user", user)
            if (user !== null) {
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
        // console.log("currentState", currentState)
        return () => console.log("something has removed")
    }, [firebase.auth().currentUser])

    // console.log({ admin, loginUser })
    // console.log("admin?.email", admin?.email)

    return (
        <Router>
            <NavBar />
            <Switch>
                {!admin?.email && !loginUser?.email ?
                    <>  <Route exact path="/" component={Login} />
                        <Route path="/Signup" component={SignUp} />
                        <Route path="/forget" component={forgetPassword} />
                    </>
                    : null
                }
                {Object.keys(admin).length > 0 && admin?.uid === "b6IparKn3BPnSDhUzuVyOhLqyuW2" ?
                    <>
                        <Route path="/allusers" component={Allusers} />
                        <Route path="/allbookings" component={AllBookings} />
                        <Route path="/adminDashboard" component={AdminDashboard} />
                        <Route path="/viewlocations" component={ViewLocations} />
                        <Route path="/addlocations" component={AddLocations} />
                    </>
                    : <Route path="/notfound" render={() => <h1>Not Found</h1>} />
                }
                {loginUser?.email !== "admin@gmail.com" ?
                    <>
                <Route path="/Dashboard" component={Dashboard} isAuth={isAuth} />
                <Route path="/showbookings" component={ShowBookings} isAuth={isAuth} />
                <Route exact path="/locations/:address/:totalSlots" component={NewBookings} isAuth={isAuth} />
                <Route exact path="/locations" component={Locations} isAuth={isAuth} />
                </>
                    : null
                }

            </Switch>
        </Router >
    )
}
