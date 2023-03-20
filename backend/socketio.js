const Server = require('socket.io')

let io
const machineSpecification = require("./machine_specification.json")
const {machine, getAllStatuses} = require("./machine");
let recipeList
resetRecipeList()
const fs = require('fs')

function init(server) {
    console.log("server initializing")
    io = Server(server, {
        cors: {
            origins: 'localhost'
        }
    })

    io.on('connection', (socket) => {
        console.log("connection initialized by id: ", socket.id)

        socket.on("echoTest", (message, callback) => {
            console.log(message)
            callback({
                "message": message
            })
            socket.emit("echoTest2", () => {
                console.log("returned from echoTest")
            })
        })

        socket.on('getMachineSpec', (callback) => {
            callback = checkCallback(callback, socket.id, "getMachineSpec")
            callback({
                "status": "ok",
                "machineSpec": machineSpecification,
            })
        })
        socket.on('getAllStatuses', (callback) => {
            callback = checkCallback(callback, socket.id, "getAllStatuses")
            // let returningThingie = Object.fromEntries(Object.values(devices).map(device => [device.name, device.allStats]))
            let returningThingie = getAllStatuses()
            callback({
                "status": "ok",
                "machine": returningThingie
            })
        })

        socket.on('setMotorSpeed', (jarName, deviceName, deviceGroup, newSpeed, callback) => {
            callback = checkCallback(callback, socket.id, "setMotorSpeed")
            console.log("received new speed: ", newSpeed, " for ", deviceName, " of ", jarName)
            switch (deviceGroup) {
                case "coolantMotor":
                    machine["coolantMotor"].Speed = newSpeed
                    callback({
                        "status": "ok",
                        "newSpeed": newSpeed
                    })
                    break
                case "startJars":
                    if (machine["startJars"].some(motor => {
                        if (motor.name === deviceName) {
                            motor.Speed = newSpeed
                            callback({
                                "status": "ok",
                                "newSpeed": newSpeed
                            })
                            return true
                        }
                    }))
                        break
                    callback({
                        "status": "error",
                        "errorMessage": "device not found"
                    })
                    break
                case "finalJars":
                    if (machine["finalJars"].has(jarName)) {
                        let currentJar = machine["finalJars"].get(jarName)
                        currentJar.impellerMotor.Speed = newSpeed
                        callback({
                            "status": "ok",
                            "newSpeed": newSpeed
                        })
                    }
                    break
                default:
                    callback({
                        "status": "error",
                        "errorMessage": "jar not found"
                    })
            }
        })
        socket.on('toggleValve', (jarName, deviceName, deviceGroup, state, callback) => {
            callback = checkCallback(callback, socket.id, "toggleValve")
            if (!machine["finalJars"].has(jarName)) {
                callback({
                    "status": "error",
                    "errorMessage": "jar not found"
                })
            }
            // console.log("received new state: ", state, " for ", deviceName, " of ", jarName)
            let currentJar = machine["finalJars"].get(jarName)
            switch (deviceGroup) {
                case "ingredientValve":
                    currentJar.valves.get(deviceName)["valve"].openState = state
                    callback({
                        "status": "ok"
                    })
                    break
                case "tempValve":
                    currentJar.tempValve.openState = state
                    callback({
                        "status": "ok"
                    })
                    break
                default:
                    callback({
                        "status": "error",
                        "errorMessage": "valve type not found"
                    })
            }
        })

        socket.on('setSensor', (jarName, deviceGroup, newValue, callback) => {
            callback = checkCallback(callback, socket.id, "loadRecipe")
            if (!machineSpecification["debug"]) {
                callback({
                    "status": "error",
                    "errorMessage": "can't set sensor when debug is not on"
                })
                return
            }
            if (!machine["finalJars"].has(jarName)) {
                callback({
                    "status": "error",
                    "errorMessage": "Jar not found"
                })
                return
            }
            let currentJar = machine["finalJars"].get(jarName)
            switch (deviceGroup) {
                case "tempProbe":
                    // console.log("received new value for tempProbe of ", jarName, ": ", newValue)
                    currentJar.tempProbe.setValue = newValue
                    break
                default:
                    callback({
                        "status": "error",
                        "errorMessage": "device type not found"
                    })
                    return
            }
            callback({
                "status": "ok"
            })
        })

        socket.on('setRecipe', (newRecipe, callback) => {
            callback = checkCallback(callback, socket.id, "setRecipe")
            recipeList[newRecipe["name"]] = newRecipe
            fs.writeFile("./recipes/" + newRecipe["name"] + ".json", JSON.stringify(newRecipe), (err) => {
                if (err) {
                    callback({
                        "status": "error",
                        "errorMessage": "Save failed with error: " + err
                    })
                    throw err
                }
                console.log("Recipe", newRecipe["name"], "has been saved");
                updateRecipeListFile(callback)
            })
        })

        socket.on('getRecipe', (recipeName, callback) => {
            callback = checkCallback(callback, socket.id, "getRecipe")
            let returningRecipe = recipeList[recipeName]
            if (returningRecipe !== undefined && returningRecipe !== null) {
                console.log("returning recipe:", returningRecipe)
                callback({
                    "status": "ok",
                    "recipe": returningRecipe
                })
                return
            }
            callback({
                "status": "error",
                "errorMessage": "recipe not found"
            })
        })

        socket.on('removeRecipe', (recipeName, callback) => {
            callback = checkCallback(callback, socket.id, "removeRecipe")
            let removingRecipe = recipeList[recipeName]
            if (removingRecipe !== undefined && removingRecipe !== null) {
                console.log("removing recipe:", removingRecipe)
                delete recipeList[recipeName]
                fs.unlink("recipes/" + recipeName + ".json", ()=>{
                    callback({
                        "status": "ok",
                        "recipe": removingRecipe
                    })
                    updateRecipeListFile()
                })
                return
            }
            callback({
                "status": "error",
                "errorMessage": "recipe not found"
            })
        })

        socket.on('getRecipeList', (callback) => {
            callback = checkCallback(callback, socket.id, "getRecipeList")
            callback({
                "status": "ok",
                "list": recipeList
            })
        })

        socket.on('saveRecipe', (newRecipe, callback) => {
            callback = checkCallback(callback, socket.id, "saveRecipe")
            recipeList[newRecipe["name"]] = newRecipe
            fs.writeFile("./recipes/" + newRecipe["name"] + ".json", newRecipe, (err) => {
                if (err) {
                    callback({
                        "status": "error",
                        "errorMessage": "Save failed with error: " + err
                    })
                    throw err
                }
                console.log("Recipe", newRecipe["name"], "has been saved");
                callback({
                    "status": "ok"
                })
            })
        })

        socket.on('loadRecipe', (newRecipe, jarName, callback) => {
            callback = checkCallback(callback, socket.id, "loadRecipe")
            if (!machine["finalJars"].has(jarName)) {
                callback({
                    "status": "error",
                    "errorMessage": "Jar not found"
                })
                return
            }

            machine["finalJars"].get(jarName).setRecipe = newRecipe;
            callback({
                "status": "ok"
            })
        })

        socket.on('loadRecipeFile', (newRecipe, jarName, callback) => {
            callback = checkCallback(callback, socket.id, "loadRecipe")
            if (!machine["finalJars"].has(jarName)) {
                callback({
                    "status": "error",
                    "errorMessage": "Jar not found"
                })
                return
            }

            machine["finalJars"].get(jarName).setRecipe = JSON.parse(newRecipe.toString());
            callback({
                "status": "ok"
            })
        })

        socket.on('startIncubationPrep', (jarName, callback) => {
            callback = checkCallback(callback, socket.id, "startIncubationPrep")
            if (!machine["finalJars"].has(jarName)) {
                callback({
                    "status": "error",
                    "errorMessage": "Jar not found"
                })
                return
            }
            let currentJar = machine["finalJars"].get(jarName)
            if (currentJar.recipe === null || currentJar.recipe === undefined) {
                callback({
                    "status": "error",
                    "errorMessage": "Recipe not loaded"
                })
                return
            }

            currentJar.startIncubationPrep()
            callback({
                "status": "ok"
            })
        })

        socket.on('startRecipe', (jarName, callback) => {
            callback = checkCallback(callback, socket.id, "startRecipe")
            if (!machine["finalJars"].has(jarName)) {
                callback({
                    "status": "error",
                    "errorMessage": "Jar not found"
                })
                return
            }
            let currentJar = machine["finalJars"].get(jarName)
            if (!currentJar.incubateReady) {
                callback({
                    "status": "error",
                    "errorMessage": "jar not incubated"
                })
                return
            }


            currentJar.startRecipe()
            callback({
                "status": "ok"
            })
        })

        socket.on('pauseRecipe', (jarName, callback) => {
            callback = checkCallback(callback, socket.id, "pauseRecipe")
            if (!machine["finalJars"].has(jarName)) {
                callback({
                    "status": "error",
                    "errorMessage": "Jar not found"
                })
                return
            }
            let currentJar = machine["finalJars"].get(jarName)
            if (currentJar.recipe === null || currentJar.recipe === undefined) {
                callback({
                    "status": "error",
                    "errorMessage": "Recipe not loaded"
                })
                return
            }
            if (currentJar.state !== "running") {
                callback({
                    "status": "error",
                    "errorMessage": "Recipe not running"
                })
            }
            currentJar.pauseRecipe()
            callback({
                "status": "ok"
            })
        })
        socket.on('cancelRecipe', (jarName, callback) => {
            callback = checkCallback(callback, socket.id, "cancelRecipe")
            if (!machine["finalJars"].has(jarName)) {
                callback({
                    "status": "error",
                    "errorMessage": "Jar not found"
                })
                return
            }
            let currentJar = machine["finalJars"].get(jarName)
            if (currentJar.recipe === null || currentJar.recipe === undefined) {
                callback({
                    "status": "error",
                    "errorMessage": "Recipe not loaded"
                })
                return
            }
            if (currentJar.state !== "running") {
                callback({
                    "status": "error",
                    "errorMessage": "Recipe not running"
                })
            }
            currentJar.cancelRecipe()
            callback({
                "status": "ok"
            })
        })
    })
}

function checkCallback(callback, socketID, functionName) {
    if (typeof callback !== 'function') {
        console.log(socketID + " triggered " + functionName + " without providing a callback")
        return (_) => {}
    } else return callback
}

function resetRecipeList() {
    recipeList = Object.fromEntries(require("./recipes/recipeList.json").map(fileName => {
        let recipe = require("./recipes/" + fileName)
        return [recipe.name, recipe]
    }))
}

function updateRecipeListFile(callback){
    if (typeof callback !== 'function') {
        callback =  (_) => {}
    }
    fs.writeFile("./recipes/recipeList.json", "[\"" + Object.keys(recipeList).join("\",\"") + "\"]", (err) => {
        if (err) {
            callback({
                "status": "error",
                "errorMessage": "recipeList write file error: " + err
            })
            throw err
        }
        callback({
            "status": "ok"
        })
    })
}

module.exports = {
    init: init
}