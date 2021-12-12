import React, { useState, useEffect } from 'react';
import Routes from './Routers/Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import firebase from "./Components/firebase/index"
import SweetAlert from 'react-bootstrap-sweetalert';


function App() {

  const [state, setState] = useState({
    show: false
  })

  const check = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!!user) {
        firebase.database().ref("clients/").child(user?.uid).on("value", (snapshot) => {
          if (snapshot.val()?.block === true) {
            setState({ show: true })
          }
          else {
            setState({ show: false })
          }
        })
      }
    })
  }

  useEffect(() => {
    check()

  }, [])


  const onConfirm = () => {
    firebase.auth().signOut().then(() => setState({ show: false }))
    localStorage.removeItem("loginUser")
    window.location.reload()
  }

  return (
    <div className="App">
      {state.show && (
        <SweetAlert
          warning
          confirmBtnText="Ok"
          confirmBtnBsStyle="light"
          onConfirm={() => {
            onConfirm()
          }}
        >
          <b>You are Blocked!</b>
        </SweetAlert>
      )}
      <Routes />
    </div>
  );
}

export default App;
