import React from "react";
import {socket} from "../context/socket";
import {notifyBad} from "../notify";

const ValveControl = ({valve}) => {

    return (
        <li className="valve-li">
            {valve.name} &#40;{valve.jarName}&#41;
            <button className="valve-button"
                    onClick={(e) => {
                        e.preventDefault();
                        console.log(valve)
                        socket.emit("toggleValve", valve.jarName, valve.name, valve.deviceGroup, !valve.opened, (data) => {
                            if (data["status"] === "error") {
                                notifyBad(data["errorMessage"])
                            } else {
                                console.log("Valve changed:", data)
                            }
                        })
                    }}
            >
                {valve.opened ? "Close" : "Open"}
            </button>
        </li>
    );
};

export default ValveControl;
