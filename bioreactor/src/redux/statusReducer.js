function statusReducer(
    machineStatus = {finalJars: {}, startJars: [], coolantMotor: {}},
    action
) {
    switch (action.type) {
        case "UPDATE_WHOLE_STATUS":
            return action.newStatus;
        case "UPDATE_MOTOR_SPEED":
            switch (action.deviceGroup) {
                case "coolantMotor":
                    return {
                        ...machineStatus,
                        coolantMotor: {
                            ...machineStatus["coolantMotor"],
                            speed: action.newSpeed,
                        },
                    };
                case "startJars":
                    return {
                        ...machineStatus,
                        startJars: machineStatus["startJars"].map((startJar) => {
                            if (startJar["name"] === action.jarName) {
                                return {
                                    ...startJar,
                                    impellerMotor: {
                                        ...startJar["impellerMotor"],
                                        speed: action.newSpeed,
                                    },
                                };
                            }
                            return startJar;
                        }),
                    };
                case "finalJars":
                    console.log(
                        "motor speed change request received. new action: ",
                        action
                    );
                    let newStatus = {
                        ...machineStatus,
                        finalJars: machineStatus["finalJars"].map((finalJar) => {
                            if (finalJar["name"] === action.jarName) {
                                console.log("found jar");
                                return {
                                    ...finalJar,
                                    impellerMotor: {
                                        ...finalJar["impellerMotor"],
                                        speed: action.newSpeed,
                                    },
                                };
                            }
                            return finalJar;
                        }),
                    };
                    console.log(
                        "old status: ",
                        machineStatus,
                        " and new status: ",
                        newStatus
                    );
                    return newStatus;
                default:
                    console.log("motor type not found: ", action.type);
                    return machineStatus;
            }
        case "UPDATE_VALVE":
            switch (action.deviceGroup) {
                case "tempValve":
                    return {
                        ...machineStatus,
                        finalJars: machineStatus["finalJars"].map((finalJar) => {
                            if (finalJar["name"] === action.jarName) {
                                return {
                                    ...finalJar,
                                    tempValve: {
                                        ...finalJar["tempValve"],
                                        opened: action.opened,
                                    },
                                };
                            }
                            return finalJar;
                        }),
                    };
                case "ingredientValve":
                    return {
                        ...machineStatus,
                        finalJars: machineStatus["finalJars"].map((finalJar) => {
                            if (finalJar["name"] === action.jarName) {
                                return {
                                    ...finalJar,
                                    valves: finalJar["valves"].map((valve) => {
                                        if (valve["name"] === action.name) {
                                            return {
                                                ...valve,
                                                opened: action.opened,
                                            };
                                        }
                                        return valve;
                                    }),
                                };
                            }
                            return finalJar;
                        }),
                    };
                default:
                    console.log("valve type not found: ", action.type);
                    return machineStatus;
            }
        case "UPDATE_SENSOR_VALUE":
            switch (action.deviceGroup) {
                case "tempProbe":
                    return {
                        ...machineStatus,
                        finalJars: machineStatus["finalJars"].map((finalJar) => {
                            if (finalJar["name"] === action.jarName) {
                                return {
                                    ...finalJar,
                                    tempProbe: {
                                        ...finalJar["tempProbe"],
                                        value: action.value,
                                    },
                                };
                            }
                            return finalJar;
                        }),
                    };
                default:
                    console.log("update_sensor_value wtf");
            }
            break;
        default:
            // console.log("redux defaulting");
            return machineStatus;
    }
}

export default statusReducer;
