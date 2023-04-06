class Sensor {
    pin
    value = 0

    constructor(pin, name, jarName, deviceGroup, debug) {
        this.pinCode = pin
        this.name = name
        this.jarName = jarName
        this.debug = debug
        this.deviceGroup = deviceGroup

        if (debug === false) {
            const raspi = require('raspi');
            const pwm = require('raspi-soft-pwm');
            raspi.init(() => {
                this.pin = new pwm.SoftPWM({pin: pin, frequency: 200});
                console.log("sensor on pin", pin, "has been initialized")
            })
        }
    }

    set setValue(newValue) {
        if (!this.debug)
            return
        this.value = newValue
    }

    get allStats() {
        return {
            "pin": this.pinCode,
            "value": this.value,
            "debug": this.debug,
            "name": this.name,
            "jarName": this.jarName,
            "deviceGroup": this.deviceGroup,
            "type": "sensor"
        }
    }
}

module.exports = {
    Sensor: Sensor
}