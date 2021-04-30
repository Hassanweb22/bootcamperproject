import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import firebase from "../Components/firebase/index"

const PrivateRoute = ({ isAuth: isAuth, restricted, component: Component, ...rest }) => {

  useEffect(() => {
    firebase.auth().onAuthStateChanged()
    return () => console.log("Private routes has removed")
  }, [])

  return (
    // <Route
    //   {...rest}
    //   render={props => {
    //     return (!Object.keys(loginUser).length > 0) ? (
    //       <Component {...props} />
    //     ) : (
    //       <Redirect to={{ pathname: "/", state: { from: props.location } }} />
    //     );
    //   }}
    // />
    <Route {...rest} render={(props) => {
      return (isAuth === true && restricted) ? (
        // <Redirect to="/dashboard" />
        <Component {...props} />
      ) : (
        <Redirect to="/" />
      );
    }} />
  );
};

export default PrivateRoute;
