import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import firebase from "../Components/firebase/index"

const PrivateRoute = ({ isAuth: isAuth, component: Component, ...rest }) => {

  useEffect(() => {

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
      if (isAuth) {
        return <Component {...props} />
      }
      else {
        return <Redirect to={{ pathname: "/", state: { from: props.location } }} />
      }
    }} />
  );
};

export default PrivateRoute;
