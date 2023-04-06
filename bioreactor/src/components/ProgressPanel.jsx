import React from "react";
import ClimbingBoxLoader from "react-spinners/ClimbingBoxLoader";
import BounceLoader from "react-spinners/BounceLoader";
import HashLoader from "react-spinners/HashLoader";
import MovingText from "react-moving-text";
import {socket} from "../context/socket";
import ToggleButton from "./ToggleButton";
import {notifyBad, notifyGood} from "../notify";

const ProgressPanel = ({jar}) => {

    const override = {
        margin: "auto"
    };

    return (
        <div className="progress-container">
            {jar.state === "idle" && (
                <div className="progress-panel">
                    <MovingText
                        className="progress-text"
                        type="fadeInFromBottom"
                        duration="1000ms"
                        delay="0s"
                        direction="normal"
                        timing="ease"
                        iteration="1"
                        fillMode="none"
                    >
                        Start incubating your jar
                    </MovingText>
                    <ToggleButton
                        className="progress-button"
                        onClick={() => {
                            socket.emit("startIncubationPrep", jar.name, (data) => {
                                if (data["status"] === "error") {
                                    notifyBad(data["errorMessage"])
                                }
                                console.log("start incubation prep for", jar.name)
                            })
                        }}
                    >
                        Start incubation
                    </ToggleButton>
                </div>
            )}
            {jar.state === "incubationPrep" && !jar.incubateReady && (
                <div className="progress-panel">
                    <MovingText
                        className="progress-text"
                        type="fadeInFromBottom"
                        duration="1000ms"
                        delay="0s"
                        direction="normal"
                        timing="ease"
                        iteration="1"
                        fillMode="none"
                    >
                        Preparing your incubation...
                    </MovingText>

                    <MovingText
                        className="progress-text"
                        type="fadeInFromBottom"
                        duration="1000ms"
                        delay="0s"
                        direction="normal"
                        timing="ease"
                        iteration="1"
                        fillMode="none"
                    >
                        Required Temp: {jar.recipe.temperature} °F
                    </MovingText>
                    <div className="loading-bar"><ClimbingBoxLoader color="#59CB59" cssOverride={override} size={25}/>
                    </div>
                    {!jar.incubateReady && jar.cooling && <MovingText
                        className="progress-text"
                        type="fadeInFromBottom"
                        duration="1000ms"
                        delay="0s"
                        direction="normal"
                        timing="ease"
                        iteration="1"
                        fillMode="none"
                    >
                        The temperature is too high.<br/>
                        Cooling this jar is in progress...
                    </MovingText>}
                    {!jar.incubateReady && !jar.cooling && <MovingText
                        className="progress-text"
                        type="fadeInFromBottom"
                        duration="1000ms"
                        delay="0s"
                        direction="normal"
                        timing="ease"
                        iteration="1"
                        fillMode="none"
                    >
                        The temperature is too low.<br/>
                        Heating this jar is in progress...
                    </MovingText>}
                </div>
            )}
            {jar.state === "incubationPrep" && jar.incubateReady && (
                <div className="progress-panel">
                    <MovingText
                        className="progress-text"
                        type="fadeInFromBottom"
                        duration="1000ms"
                        delay="0s"
                        direction="normal"
                        timing="ease"
                        iteration="1"
                        fillMode="none"
                    >
                        Incubation is done!
                    </MovingText>
                    <MovingText
                        className="progress-text"
                        type="fadeInFromBottom"
                        duration="1000ms"
                        delay="0s"
                        direction="normal"
                        timing="ease"
                        iteration="1"
                        fillMode="none"
                    >
                        Press to start your Recipe
                    </MovingText>
                    <ToggleButton
                        className="progress-button"
                        onClick={() => {
                            socket.emit("startRecipe", jar.name, (data) => {
                                if (data["status"] === "error") {
                                    notifyBad(data["errorMessage"])
                                }
                                console.log("start recipe for", jar.name)
                            })
                        }}
                    >
                        Start
                    </ToggleButton>
                </div>
            )}
            {jar.state === "running" && (
                <div className="progress-panel">
                    <MovingText
                        className="progress-text"
                        type="fadeInFromBottom"
                        duration="1000ms"
                        delay="0s"
                        direction="normal"
                        timing="ease"
                        iteration="1"
                        fillMode="none"
                    >
                        In progress...
                    </MovingText>
                    <div className="loading-bar"><HashLoader color="#59CB59" cssOverride={override} size={120}/></div>
                    <ToggleButton
                        className="progress-button"
                        onClick={() => {
                            socket.emit("pauseRecipe", jar.name, (data) => {
                                if (data["status"] === "error") {
                                    notifyBad(data["errorMessage"])
                                }
                            })
                        }
                        }>Pause</ToggleButton>
                </div>
            )}
            {jar.state === "paused" && (
                <>
                    <div className="progress-panel">
                        <MovingText
                            className="progress-text"
                            type="fadeInFromBottom"
                            duration="1000ms"
                            delay="0s"
                            direction="normal"
                            timing="ease"
                            iteration="1"
                            fillMode="none"
                        >
                            Paused
                        </MovingText>
                        <div className="loading-bar"><BounceLoader color="#FFBC00" cssOverride={override} size={100}/>
                        </div>
                        <ToggleButton className="progress-button" onClick={() => {
                            socket.emit("startRecipe", jar.name, (data) => {
                                if (data["status"] === "error") {
                                    notifyBad(data["errorMessage"])
                                }
                            })
                        }
                        }>Restart</ToggleButton>

                    </div>
                </>
            )}

            <button
                type="button"
                className="form-button cancel"
                onClick={() => {
                    socket.emit("cancelRecipe", jar.name, (data) => {
                        if (data["status"] === "error") {
                            notifyBad(data["errorMessage"])
                        } else {
                            notifyGood("Recipe for " + jar.name + " cancelled.")
                        }
                    })
                }}
            >
                Cancel
            </button>

        </div>
    );
};

export default ProgressPanel;
