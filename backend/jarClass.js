const {Motor} = require("./motorWrapper");
const {Valve} = require("./valveWrapper");
const {Sensor} = require("./sensorWrapper");
const machineSpecification = require("./machine_specification.json")
let {pumpOnSignal} = require("./machine")

class Jar {
    recipe
    state = "idle"
    tempPolling
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
                    "valve": new Valve(individualValve["pin"], individualValve["name"], name, this.debug)
                }
            ]
        ))

        this.tempValve = new Valve(this.specification["tempValve"]["pin"], name + "TempValve", name, this.debug)
        this.tempProbe = new Sensor(this.specification["tempProbe"]["pin"], name + "TempProbe", name, this.debug)
    }

    set recipe(newRecipe) {
        this.recipe = newRecipe
        this.impellerMotor.actionQueue = [{
            "speed": newRecipe["motorSpeed"],
            "time": newRecipe["time"],
            "startTime": 0
        }]
        Object.entries(this.valves).forEach((valve, valveName) => {
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

    start(){
        //this interval runs until the recipe is cancelled
        this.tempPolling = setInterval(()=>{
            if(this.tempProbe.value > (this.recipe["temperature"] + 3) && !this.cooling){
                pumpOnSignal += 1
                this.cooling = true
            } else if(this.tempProbe.value < (this.recipe["temperature"] - 3) && this.cooling){
                pumpOnSignal -= 1
                this.cooling = false
            }
        }, 1000)
        this.incubatePrep = setInterval(()=>{
            if(Math.abs(this.tempProbe.value - this.recipe["temperature"]) < 1){
                this.incubateReady = true
                clearInterval(this.incubatePrep)
            }
        }, 1000)
    }

    startRecipe(){
        this.state = "running"
        this.impellerMotor.executeNextCommand()
        this.valves.forEach((valve, _) => {
            valve["valve"].executeNextCommand()
        })
    }

    pauseRecipe(){
        this.state = "paused"
        this.impellerMotor.pause()
        this.valves.forEach((valve, _) => {
            valve["valve"].pause()
        })
    }

    get allStats(){
        return {
            "name": this.name,
            "debug": this.debug,
            "recipe": this.recipe,
            "state": this.state,
            "incubateReady": this.incubateReady,
            "cooling": this.cooling,
            "motor": this.impellerMotor.allStats,
            "valves": Array.from( this.valves ).map(([_, value]) => value["valve"].allStats),
            "tempValve": this.tempValve.allStats,
            "tempProbe": this.tempProbe.allStats
        }
    }
}

module.exports = {
    Jar: Jar
}