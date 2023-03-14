const {Jar} = require("./jarClass");
const {Motor} = require("./motorWrapper");
let {pumpOnSignal} = require("./pumpOnSignal")

const machineSpecification = require("./machine_specification.json")

let machine = {
    "finalJars": new Map(Object.keys(machineSpecification["finalJars"]).map(jarName => [jarName, new Jar(jarName)])),
    "startJars": machineSpecification["startJars"].map(
        ingredientJar => new Motor(
            ingredientJar["pumpMotor"]["pin"],
            ingredientJar["ingredient"] + " pump",
            ingredientJar["ingredient"],
            machineSpecification["debug"]
        )
    ),
    "coolantMotor": new Motor(
        machineSpecification["coolantMotor"]["pin"],
        "coolantMotor",
        "coolant",
        machineSpecification["debug"]
    )
}

function getAllStatuses() {
    return {
        "finalJars": Array.from(machine["finalJars"]).map(([_, jar]) => jar.allStats),
        "startJars": machine["startJars"].map(startJarPump => startJarPump.allStats),
        "coolantMotor": machine["coolantMotor"].allStats
    }
}

setInterval(() => {
    if (!machine) {
        return
    }
    if (pumpOnSignal["on"] > 0) {
        machine["coolantMotor"].Speed = 1000
        console.log("cooling motor on")
    } else {
        machine["coolantMotor"].Speed = 0
        console.log("cooling motor off")
    }
}, 1000)

module.exports = {
    machine: machine,
    getAllStatuses: getAllStatuses
}