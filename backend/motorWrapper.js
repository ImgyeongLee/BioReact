class Motor {
    cancel;
    // motor's actionQueue's structure:
    // {
    //     "speed": someSpeed, Motor's desired speed in this timeframe, from 0 to 1000
    //     "time": timeInMiliseconds, how long this command should last
    //     "startTime": timeInMiliseconds, when the command started. Do not set or change this value manually
    // }
    actionQueue = []
    state = "idle" //"running", "paused", "idle"
    speed = 0

    constructor(pin, name, jarName, deviceGroup, debug) {
        this.pinCode = pin
        this.debug = debug
        this.name = name
        this.jarName = jarName
        this.deviceGroup = deviceGroup


        if (!debug) {
            const raspi = require('raspi');
            const pwm = require('raspi-soft-pwm');
            raspi.init(() => {
                this.pin = new pwm.SoftPWM({pin: pin, frequency: 200});
                console.log("motor on pin", pin, "has been initialized")
            })
        }
    }

    set Speed(speed) {
        this.speed = speed
        if (!this.debug)
            this.pin.write(speed)
    }

    get allStats() {
        return {
            "pin": this.pinCode,
            "speed": this.speed,
            "debug": this.debug,
            "name": this.name,
            "jarName": this.jarName,
            "deviceGroup": this.deviceGroup,
            "type": "motor"
        }
    }

    executeNextCommand() { //execute next command in the actionQueue
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
        this.Speed = currentCommand["speed"]
        this.cancel = setTimeout(() => {
            this.actionQueue.shift()
            this.executeNextCommand()
        }, currentCommand["time"])
    }

    pause() { //pause the current actionQueue
        if (this.state !== "running")
            return
        let currentCommand = this.actionQueue[0]
        this.state = "paused"
        clearTimeout(this.cancel)
        this.Speed = 0
        currentCommand["time"] = currentCommand["time"] - (new Date() - currentCommand["startTime"]) //reduce activation time for resuming
    }

    cancelCurrentQueue() { //cancel the action queue and stop the motor, making it impossible to resume
        this.actionQueue = []
        this.state = "idle"
        this.Speed = 0
    }
}

module.exports = {
    Motor: Motor,
}