import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import firebase from "../Components/firebase/index"

const PrivateRoute = ({ component: Component, ...rest }) => {

  const [authUser, setAuthuser] = useState({})
  useEffect(() => {
    let user = firebase.auth().currentUser
    console.log("Private Routes user", firebase.auth().currentUser)
    // if (user.email === "admin@gmail.com") {
    //   setAuthuser(user)
    // }
    return () => console.log("Private Routes")
  }, [])

  return (
    <Route
      {...rest}
      render={props => {
        return (authUser === {}) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        );
      }}
    />
  );
};

export default PrivateRoute;
