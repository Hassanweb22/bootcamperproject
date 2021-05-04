import React, { useState, useEffect } from 'react';
import Routes from './Routers/Routes';
import { useHistory } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase from "./Components/firebase/index"
import './App.css';


function App() {
  const history = useHistory()
  useEffect(() => {
    const check = () => {
      const user = firebase.auth().currentUser
      // firebase.auth().onAuthStateChanged((user) => {
        console.log("App.js user", user)
        if (!!user) {
          firebase.database().ref("clients/").child(user.uid).on("child_changed", snapshot => {
            if (snapshot.val().hasOwnProperty('block')) {
              if (snapshot.val()?.block === true) {
                console.log("App.js Block", snapshot.val().block)
                firebase.auth().signOut()
                return
              }
            }
          })
        }
      // })
    }
    check()
  }, [])


  return (
    <div className="App">
      <Routes />
    </div>
  );
}

export default App;
