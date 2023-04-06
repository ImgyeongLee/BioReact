import React from "react";
import MotorPanel from "../components/MotorPanel";
import ValvePanel from "../components/ValvePanel";
import IngredientControlPanel from "../components-control/IngredientControlPanel";
import {useSelector} from "react-redux";
import {getLocalStatus} from "../redux/selectors";
import {socket} from "../context/socket";
import {notifyBad} from "../notify";

const Manual = () => {
    const deviceStatus = useSelector(getLocalStatus);
    const manualState = deviceStatus["manual"]

    // useEffect(()=>{
    //     if(socket !== undefined)
    //     socket.emit("getManual", (data) => {
    //         if(data["status"] === "error"){
    //             console.log("getManual error:", data["errorMessage"])
    //             return
    //         }
    //         setManualState(data["manual"])
    //     })
    // }, [socket])

    if (!deviceStatus.startJars[0]) {
        return;
    }

    if (!deviceStatus.finalJars[0]) {
        return;
    }

    function handleManualToggle() {
        if (socket !== undefined)
            socket.emit("setManual", !manualState, (data) => {
                if (data["status"] === "error") {
                    notifyBad(data["errorMessage"])
                    console.log("setManual error:", data["errorMessage"])
                    // return
                }
                // setManualState(!manualState)
            })
    }

    return (
        <>
            {!manualState && (<>
                <div className="warning-text">Please make sure all jars are empty.</div>
                <div className="unable-screen "></div>
            </>)}
            <div className="manual-container">
                <button className="engage-button"
                        onClick={handleManualToggle}>{manualState ? "Disengage manual mode" : "Engage manual mode"}</button>
                <div>
                    <h1 className="control-topic">Ingredients</h1>
                    <div className="ingredient">
                        {deviceStatus.startJars.map((jar) => {
                            return (
                                <IngredientControlPanel
                                    jar={jar}
                                    // finalJars={deviceStatus.finalJars}
                                />
                            );
                        })}
                    </div>
                </div>
                <div>
                    <h1 className="control-topic">Cool water bucket</h1>
                    <section className="control-panel-card">
                        <div className="control-subject">Cool water</div>
                        <MotorPanel device={deviceStatus.coolantMotor}/>
                    </section>
                </div>
                <div>
                    <h1 className="control-topic">Jars</h1>
                    <section className="inline-flex-container">
                        {deviceStatus.finalJars.map(jar =>
                            <div className="control-panel-card">
                                <MotorPanel device={jar.impellerMotor}/>
                                <ValvePanel valves={[...jar.valves, jar.tempValve]}/>
                            </div>
                        )}
                    </section>

                </div>
            </div>
        </>
    );
};

export default Manual;
