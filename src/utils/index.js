import firebase from "../Components/firebase/index"


export const titleCase = str => {
    let str1 = str.toLowerCase()
    return str1.replace(/(^|\s)\S/g, function (t) { return t.toUpperCase() });
}

export const errorsAtLogin = async (error, setvalidationError, validationError, initialState, isGoogleAccount) => {
    setvalidationError({ ...validationError, block: "" })
    const errorCode = error.code;
    const errorMessage = error.message;
    if (!isGoogleAccount) {
        console.log({ errorCode, errorMessage })
        if (error.code === "auth/user-not-found") {
            setvalidationError({ ...validationError, email: "User have not found or may Have deleted" })
        }
        else if (error.code === "auth/wrong-password") {
            setvalidationError({ ...validationError, password: "Password is invalid" })
        }
        else if (error.code === "auth/too-many-requests") {
            setvalidationError({ ...validationError, access: "Too many try, Now Access to this account has been disabled" })
        }
        else if (error.code === "auth/network-request-failed") {
            setvalidationError({ ...validationError, connection: "Your Internet Connection has been disbaled" })
        }
        else {
            setvalidationError(initialState)
        }
    }
    else {
        await firebase.auth().signOut()
        const errorMsg = error.response?.data?.message || errorMessage
        console.log({ errorMsg })
    }
}

export const blockUser = (user, block) => {
    firebase.database().ref('clients/').child(user.key).update(
        { block: !block },
        err => {
            if (err) {
                console.log("error", err)
            }
        });
}

export const deleteUserData = (user) => {
    firebase.database().ref('clients/').child(user.key).remove()
        .then(function () {
            console.log("Remove succeeded.")
            return true
        })
        .catch(function (error) {
            console.log("Remove failed: " + error.message)
            return false
        });
}

export const checkUserBlock = (email, setvalidationError, validationError, isGoogleAccount) => {
    firebase.database().ref("clients/").on("value", snapshot => {
        Object.keys(snapshot.val()).filter(user => {
            if (snapshot.val()[user].email === email && snapshot.val()[user].block) {
                setvalidationError({ ...validationError, block: "You have been Blocked" })
                return true
            }
        })
    })
    return false
}