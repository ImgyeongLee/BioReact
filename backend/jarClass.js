const {Motor} = require("./motorWrapper");
const {Valve} = require("./valveWrapper");
const {Sensor} = require("./sensorWrapper");
const machineSpecification = require("./machine_specification.json")
let {pumpOnSignal} = require("./signals")

class Jar {
    recipe
    state = "idle"
    statusPolling
    incubatePrep
    incubateReady = false
    cooling = false

    constructor(name) {
        this.name = name
        this.debug = machineSpecification["debug"]
        this.specification = machineSpecification["finalJars"][name]
        let motorSpec = this.specification["impellerMotor"]
        this.impellerMotor = new Motor(motorSpec["pin"], motorSpec["name"], name, this.debug)

        this.valves = new Map(this.specification["valves"].map(
            individualValve => [
                individualValve["name"], {
                    "startJar": machineSpecification["startJars"][individualValve["startJar"]],
                    "valve": new Valve(individualValve["pin"], individualValve["name"], name, machineSpecification["startJars"][individualValve["startJar"]]["ingredient"], this.debug)
                }
            ]
        ))

        this.tempValve = new Valve(this.specification["tempValve"]["pin"], name + "TempValve", name, this.debug)
        this.tempProbe = new Sensor(this.specification["tempProbe"]["pin"], name + "TempProbe", name, this.debug)
    }

    set setRecipe(newRecipe) {
        this.recipe = newRecipe
        this.impellerMotor.actionQueue = [{
            "speed": newRecipe["motorSpeed"],
            "time": newRecipe["time"],
            "startTime": 0
        }]
        this.valves.forEach((valve) => {
            let valveFlowRate = valve["startJar"]["pumpRate"]
            let currentIngredient = valve["startJar"]["ingredient"]
            let requiredAmount = newRecipe["ingredients"][currentIngredient]
            let timeRequired = (requiredAmount / valveFlowRate) * 1000

            valve["valve"].actionQueue = [{
                "opened": true,
                "time": timeRequired,
                "startTime": 0
            }]
        })
        this.incubateReady = false
    }

    get allStats() {
        return {
            "name": this.name,
            "debug": this.debug,
            "recipe": this.recipe,
            "state": this.state,
            "incubateReady": this.incubateReady,
            "cooling": this.cooling,
            "impellerMotor": this.impellerMotor.allStats,
            "valves": Array.from(this.valves).map(([_, value]) => value["valve"].allStats),
            "tempValve": this.tempValve.allStats,
            "tempProbe": this.tempProbe.allStats
        }
    }

    startIncubationPrep() {
        this.state = "incubationPrep"
        //this interval runs until the recipe is cancelled
        this.statusPolling = setInterval(() => {
            //determine if the cooling motor needs to run or not
            if (this.tempProbe.value > (this.recipe["temperature"] + 2) && !this.cooling) {
                if(pumpOnSignal)
                    pumpOnSignal["on"] += 1
                this.cooling = true
            } else if (this.tempProbe.value < (this.recipe["temperature"] - 2) && this.cooling) {
                if(pumpOnSignal)
                    pumpOnSignal["on"] -= 1
                this.cooling = false
            }
            //check if jar is idling
            if (this.state !== "incubationPrep" && this.impellerMotor.state === "idle" && this.tempValve.state === "idle") {
                let idling = true
                this.valves.forEach((valve, _) => {
                    if (valve["valve"].state !== "idle")
                        idling = false
                })
                if (idling) {
                    this.state = "idle"
                    this.recipe = null
                    clearInterval(this.statusPolling)
                }
            }
        }, 1000)
        this.incubatePrep = setInterval(() => {
            if (Math.abs(this.tempProbe.value - this.recipe["temperature"]) < 1) {
                this.incubateReady = true
                clearInterval(this.incubatePrep)
            }
        }, 1000)
    }

    startRecipe() {
        this.state = "running"
        this.impellerMotor.executeNextCommand()
        this.valves.forEach((valve, _) => {
            valve["valve"].executeNextCommand()
        })
    }

    pauseRecipe() {
        this.state = "paused"
        this.impellerMotor.pause()
        this.valves.forEach((valve, _) => {
            valve["valve"].pause()
        })
    }

    cancelRecipe() {
        this.state = "idle"
        this.impellerMotor.cancelCurrentQueue()
        this.valves.forEach((valve, _) => {
            valve["valve"].cancelCurrentQueue()
        })
    }
}

module.exports = {
    Jar: Jar
}