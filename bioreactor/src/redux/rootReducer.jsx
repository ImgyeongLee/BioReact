import {combineReducers} from "redux";

import jarReducer from "./reducers";
import recipeReducer from "./recipeReducer";
import statusReducer from "./statusReducer";
import jarNameReducer from "./jarNameReducer";
import recipeListReducer from "./recipeListReducer";

const rootReducer = combineReducers({
    recipe: recipeReducer,
    recipeList: recipeListReducer,
    jars: jarReducer,
    machineStatus: statusReducer,
    jarName: jarNameReducer,
});

export default rootReducer;
