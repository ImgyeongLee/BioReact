// reducer that holds the selected recipe
import {SELECT_JAR} from "./actions";

const initState = null;

function jarNameReducer(state = initState, action) {
    switch (action.type) {
        case SELECT_JAR:
            state = action.jar;
            console.log(state);
            return state;
        default:
            return state;
    }
}

export default jarNameReducer;
