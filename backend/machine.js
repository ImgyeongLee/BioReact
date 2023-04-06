const {Jar} = require("./jarClass");
const {Motor} = require("./motorWrapper");
let {states, ingredientOnSignal} = require("./states")

const machineSpecification = require("./machine_specification.json")

let machine = {
    "finalJars": new Map(Object.keys(machineSpecification["finalJars"]).map(jarName => [jarName, new Jar(jarName)])),
    "startJars": new Map(machineSpecification["startJars"].map(
        ingredientJar => [ingredientJar["ingredient"], new Motor(
            ingredientJar["pumpMotor"]["pin"],
            ingredientJar["ingredient"] + " pump",
            ingredientJar["ingredient"],
            "startJars",
            machineSpecification["debug"]
        )]
    )),
    "coolantMotor": new Motor(
        machineSpecification["coolantMotor"]["pin"],
        "coolantMotor",
        "coolant",
        "coolantMotor",
        machineSpecification["debug"]
    )
}

function getAllStatuses() {
    return {
        "manual": states.manual,
        "finalJars": Array.from(machine["finalJars"], ([_, jar]) => jar.allStats),
        "startJars": Array.from(machine["startJars"], ([_, startJarPump]) => startJarPump.allStats),
        "coolantMotor": machine["coolantMotor"].allStats
    }
}

//automatic machine interval.
setInterval(() => {
    if (!machine || states.manual) {
        return
    }
    if (states.pumpOnSignal > 0) {
        machine["coolantMotor"].Speed = 1000
    } else {
        machine["coolantMotor"].Speed = 0
    }
    machine["startJars"].forEach(ingredientPump => {
        if(ingredientOnSignal[ingredientPump["jarName"]] === undefined)
            return
        let signal = ingredientOnSignal[ingredientPump["jarName"]]
        if(signal > 0){
            ingredientPump.Speed = 1000
        } else {
            ingredientPump.Speed = 0
        }
    })
}, 1000)

module.exports = {
    machine: machine,
    getAllStatuses: getAllStatuses
}