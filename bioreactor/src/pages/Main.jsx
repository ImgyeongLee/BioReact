import React from "react";
import {useSelector} from "react-redux";
import {getLocalStatus} from "../redux/selectors";
import Jar from "../components/Jar";
import {socket} from "../context/socket";
import {notifyBad, notifyGood} from "../notify";

const Main = () => {
    const deviceStatus = useSelector(getLocalStatus);
    if (!deviceStatus.finalJars[0]) {
        return;
    }

    return (
        <div>
            <div className="jar-container">
                {deviceStatus.finalJars.map((jar) => {
                    return <Jar key={jar.name} jar={jar}/>;
                })}

            </div>
            <button className="stop-button" onClick={() => {
                deviceStatus.finalJars.forEach((jar) => {
                    socket.emit("cancelRecipe", jar.name, (data) => {
                        if (data["status"] === "error") {
                            notifyBad(jar.name + ": ", data["errorMessage"])
                        } else {
                            notifyGood("Stopped jar " + jar.name)
                        }
                    })
                })
            }
            }>STOP
            </button>
        </div>
    );
};

export default Main;
