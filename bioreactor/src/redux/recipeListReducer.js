const initState = [];

function recipeListReducer(state = initState, action) {
    switch (action.type) {
        case "UPDATE_RECIPE_LIST":
            // console.log("updating_recipe_list")
            state = action.recipeList;
            return state;
        default:
            // console.log("recipeLsitReducer defaulting. action:", action)
            return state;
    }
}

export default recipeListReducer;
