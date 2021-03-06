import React from "react";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({ block, component: Component, redirectTo, isLogin, isAdmin, isUser, ...rest }) => {
  const user = JSON.parse(localStorage.getItem("loginUser")) ? Object.keys(JSON.parse(localStorage.getItem("loginUser"))).length : null;
  // console.log(JSON.parse(localStorage.getItem("loginUser")), " user privated");

  return (
    <Route
      {...rest}
      render={props => {
        if (isAdmin || isUser) {
          return <Redirect to={redirectTo} />
        }

        return (isLogin ? !user : user) ? (
          <Component {...props} />
        ) : (
          <Redirect to={redirectTo} />
        );
      }}
    />
  );
};

export default PrivateRoute;
