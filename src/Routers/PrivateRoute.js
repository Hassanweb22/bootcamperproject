import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import firebase from "../Components/firebase/index"

const PrivateRoute = ({ component: Component, ...rest }) => {
  const user = JSON.parse(localStorage.getItem("loginUser")) ? Object.keys(JSON.parse(localStorage.getItem("loginUser"))).length : null;
  console.log(JSON.parse(localStorage.getItem("loginUser")), " user privated");
  return (
    <Route
      {...rest}
      render={props => {
        return (user) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/" />
        );
      }}
    />
  );
};

export default PrivateRoute;
