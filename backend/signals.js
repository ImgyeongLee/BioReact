const machineSpecification = require("./machine_specification.json");
let pumpOnSignal = {
    "on": 0
}

let ingredientOnSignal = Object.fromEntries(machineSpecification["startJars"].map(ingredientJar => {
    return [ingredientJar["ingredient"], 0]
}))

module.exports = {
    pumpOnSignal: pumpOnSignal,
    ingredientOnSignal: ingredientOnSignal
}