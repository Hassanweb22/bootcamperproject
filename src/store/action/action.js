let remove = "remove"
let add = "add"

const addUser = (user) => {
    console.log("addUser=>", user)
    return (dispatch) => {
        dispatch({
            type: add,
            user: user
        })
    }
}

const removeUser = (user) => {
    console.log("removeUser=>", user)
    return (dispatch) => {
        dispatch({
            type: remove,
            user: {}
        })
    }
}


export {
    addUser,
    removeUser,
    add,
    remove
}