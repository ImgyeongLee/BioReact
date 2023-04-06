// reducer that holds the selected recipe
import {SELECT_RECIPE} from "./actions";

const initState = null;

function recipeReducer(state = initState, action) {
    switch (action.type) {
        case SELECT_RECIPE:
            state = action.recipe;
            console.log(state);
            return state;
        default:
            return state;
    }
}

export default recipeReducer;
