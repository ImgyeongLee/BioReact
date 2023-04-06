let {states, ingredientOnSignal} = require("./states");

class Valve {
    // motor's actionQueue's structure:
    // {
    //     "opened": false, Valve's desired state, can be true or false
    //     "time": timeInMiliseconds, how long this command should last
    //     "startTime": timeInMiliseconds, when the command started. Do not set or change this value manually
    // }
    actionQueue = []
    gpio
    cancel
    state = "idle" //"running", "paused", "idle"
    constructor(pin, name, jarName, ingredientJarName, deviceGroup, debug) {
        this.pinCode = pin
        this.opened = false
        this.debug = debug
        this.name = name
        this.jarName = jarName
        this.ingredientJarName = ingredientJarName
        this.deviceGroup = deviceGroup

        if (debug === false) {
            const raspi = require('raspi');
            this.gpio = require('raspi-gpio');
            raspi.init(() => {
                this.pin = new this.gpio.DigitalOutput(pin);
                this.opened = this.pin.value
                console.log("valve on pin", pin, "initialized ")
            })
        }
    }

    // open() {
    //     this.opened = true
    //     if (!this.debug)
    //         this.pin.write(this.gpio.HIGH)
    // }
    //
    // close() {
    //     this.opened = false
    //     if (!this.debug)
    //         this.pin.write(this.gpio.LOW)
    // }

    set openState(newState) {
        if(this.opened !== newState){
            switch (this.deviceGroup){
                case "ingredientValve":
                    if(newState){
                        ingredientOnSignal[this.ingredientJarName] += 1
                    } else {
                        ingredientOnSignal[this.ingredientJarName] -= 1
                    }
                    break
                case "tempValve":
                    if(newState){
                        states.pumpOnSignal += 1
                    } else {
                        states.pumpOnSignal -= 1
                    }
            }
        }
        this.opened = newState
        if (!this.debug) {
            if (newState)
                this.pin.write(this.gpio.HIGH)
            else
                this.pin.write(this.gpio.LOW)
        }
    }

    get openState() {
        if (this.debug)
            return this.opened
        return this.pin.value
    }

    get allStats() {
        return {
            "pin": this.pinCode,
            "opened": this.opened,
            "debug": this.debug,
            "name": this.name,
            "jarName": this.jarName,
            "deviceGroup": this.deviceGroup,
            "type": "valve"
        }
    }

    executeNextCommand() { //start command queue execution
        if (this.actionQueue[0] === undefined || this.actionQueue[0] === null) {
            this.cancelCurrentQueue()
            return
        }

        while (this.actionQueue[0]["time"] < 1) {
            this.actionQueue.shift()
        }

        this.state = "running"
        let currentCommand = this.actionQueue[0]
        currentCommand["startTime"] = new Date()
        this.openState = currentCommand["opened"]
        this.cancel = setTimeout(() => {
            this.actionQueue.shift()
            this.executeNextCommand()
        }, currentCommand["time"])
    }

    pause() {
        if (this.state !== "running")
            return

        let currentCommand = this.actionQueue[0]
        this.state = "paused"
        clearTimeout(this.cancel)
        currentCommand["time"] = currentCommand["time"] - (new Date() - currentCommand["startTime"]) //reduce activation time for resuming
    }

    cancelCurrentQueue() { //cancel the action queue and stop the motor, making it impossible to resume
        this.actionQueue = []
        this.state = "idle"
        this.openState = false
    }
}

module.exports = {
    Valve: Valve
}