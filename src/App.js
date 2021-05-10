import React, { useState, useEffect } from 'react';
import Routes from './Routers/Routes';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import firebase from "./Components/firebase/index"
import { withSwalInstance } from 'sweetalert2-react';
import swal from 'sweetalert2';

const SweetAlert = withSwalInstance(swal);



function App() {

  const [state, setState] = useState({
    show: false
  })

  const check = () => {
    firebase.auth().onAuthStateChanged((user) => {
      if (!!user) {
        firebase.database().ref("clients/").child(user?.uid).on("value", (snapshot) => {
          if (snapshot.val()?.block === true) {
            console.log("App.js Block", snapshot.val())
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
    firebase.auth().signOut()
    localStorage.removeItem("loginUser")
    window.location.reload()
  }

  return (
    <div className="App">
      <SweetAlert
        show={state.show}
        // title="You are Blocked"
        type="warning"
        text="You are Blocked"
        onConfirm={() => {
          onConfirm()
        }}
      />
      <Routes />
    </div>
  );
}

export default App;
