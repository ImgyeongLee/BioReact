export const SELECT_RECIPE = "SELECT_RECIPE";
export const SELECT_JAR = "SELECT_JAR";
export const SELECT_INGRE_NAME = "SELECT_INGRE_NAME";
export const SELECT_AMOUNTS = "SELECT_AMOUNTS";

export function selectRecipe(recipe) {
    return {type: SELECT_RECIPE, recipe};
}

export function selectJar(jar) {
    return {type: SELECT_JAR, jar};
}

// export function selectNames(names) {
//     return {type: SELECT_INGRE_NAME, names};
// }
//
// export function selectAmounts(amounts) {
//     return {type: SELECT_AMOUNTS, amounts};
// }

export function setRecipeList(recipeList) {
    return {type: "UPDATE_RECIPE_LIST", recipeList}
}
