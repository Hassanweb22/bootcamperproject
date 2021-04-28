import React, { useState, useEffect } from "react";
import { Route, Redirect } from "react-router-dom";
import firebase from "../Components/firebase/index"

const LoginRoutes = ({ isAuth: isAuth, component: Component, ...rest }) => {

    useEffect(() => {

        return () => console.log("Private routes has removed")
    }, [])

    return (
        <Route {...rest} render={(props) => {
            if (isAuth) {
                return <Redirect to={{ pathname: "/dashboard", state: { from: props.location } }} />
            }
            else {
                return <Component {...props} />
            }
        }} />
    );
};

export default LoginRoutes;
