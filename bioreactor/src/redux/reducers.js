const emptyJars = Array.from(["Jar 1", "Jar 2", "Jar 3"], (name) => {
    return {
        name: name,
        recipe: "No recipe",
        impellerMotor: {
            pin: "No pin",
            speed: 0,
            debug: true,
            name: "No name",
            type: "motor",
        },
        temperature: 0,
        DO: 0,
        valves: [
            {
                pin: "No pin",
                state: false,
                debug: true,
                name: "No name",
                type: "valve",
            },
        ],
        state: "idle", // states should be "RUNNING", "PAUSED", and "STOPPED", i don't want to deal with JS's janky enums yet
    };
});

function mapNewJarField(jarList, jarName, field, value) {
    return jarList.map((jar) => {
        if (jar["name"] === jarName) {
            return {
                ...jar,
                [field]: value,
            };
        }
        return jar;
    });
}

export function bioreactorReducer(app = {jars: emptyJars}, action) {
    switch (action.type) {
        case "JAR_INITIALIZE": {
            return {
                ...app,
                jars: app["jars"].map((jar) => {
                    if (jar["name"] === action["jarName"]) {
                        return {
                            ...jar,
                            ...action["newJar"],
                        };
                    }
                    return jar;
                }),
            };
        }
        case "JAR_CHANGE_FIELD": {
            return {
                ...app,
                jars: mapNewJarField(
                    app["jars"],
                    action["jarName"],
                    action["field"],
                    action["newValue"]
                ),
            };
        }
        default:
            return app;
    }
}

export default function rootReducer(state = {}, action) {
    return {
        app: bioreactorReducer(state.app, action),
    };
}
