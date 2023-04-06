export function getRecipe(state) {
    return state.recipe || null;
}

export function getRecipeList(state) {
    return state.recipeList
}

export function getLocalStatus(state) {
    return state.machineStatus || null;
}

export function getJarName(state) {
    return state.jarName || null;
}
