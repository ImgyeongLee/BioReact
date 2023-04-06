const machineSpecification = require("./machine_specification.json");

//only objects are passed by reference so I'm doing it like this
let states = {
    "pumpOnSignal": 0,
    "manual": false
}

let ingredientOnSignal = Object.fromEntries(machineSpecification["startJars"].map(ingredientJar => {
    return [ingredientJar["ingredient"], 0]
}))

module.exports = {
    states: states,
    ingredientOnSignal: ingredientOnSignal,
}