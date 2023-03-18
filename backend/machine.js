const {Jar} = require("./jarClass");
const {Motor} = require("./motorWrapper");
let {pumpOnSignal, ingredientOnSignal} = require("./signals")

const machineSpecification = require("./machine_specification.json")

let machine = {
    "finalJars": new Map(Object.keys(machineSpecification["finalJars"]).map(jarName => [jarName, new Jar(jarName)])),
    "startJars": new Map(machineSpecification["startJars"].map(
        ingredientJar => [ingredientJar["ingredient"], new Motor(
            ingredientJar["pumpMotor"]["pin"],
            ingredientJar["ingredient"] + " pump",
            ingredientJar["ingredient"],
            machineSpecification["debug"]
        )]
    )),
    "coolantMotor": new Motor(
        machineSpecification["coolantMotor"]["pin"],
        "coolantMotor",
        "coolant",
        machineSpecification["debug"]
    )
}

function getAllStatuses() {
    return {
        "finalJars": Array.from(machine["finalJars"], ([_, jar]) => jar.allStats),
        "startJars": Array.from(machine["startJars"], ([_, startJarPump]) => startJarPump.allStats),
        "coolantMotor": machine["coolantMotor"].allStats
    }
}

setInterval(() => {
    if (!machine) {
        return
    }
    if (pumpOnSignal["on"] > 0) {
        machine["coolantMotor"].Speed = 1000
    } else {
        machine["coolantMotor"].Speed = 0
    }
    console.log(ingredientOnSignal)
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