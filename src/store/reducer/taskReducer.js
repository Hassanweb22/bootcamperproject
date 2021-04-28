import { add, remove } from "../action/action"

const InitialState = {
    name: "Hassan",
    email: "hassan@gmail.com",
    currentUser: {}
}

export default function taskReducer(state = InitialState, action) {
    switch (action.type) {
        case add:
            console.log("add action:", action)
            return { ...state, currentUser: action.user }
        case remove:
            console.log("remove action:", action)
            return { ...state, currentUser: action.user }
        default:
            return state
    }
}