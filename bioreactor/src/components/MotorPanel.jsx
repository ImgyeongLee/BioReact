import React, {useState} from "react";
import {FaShare} from "react-icons/fa";
import {validNumber} from "../data/regex";
import InvalidMessage from "./InvalidMessage";
import {socket} from "../context/socket";
import {notifyBad} from "../notify";

const MotorPanel = ({device}) => {
    const [onInvalid, SetOnInvalid] = useState(false);

    if (device === undefined)
        return

    // console.log("MOTOR", device)

    const handleChange = (e) => {
        // If the input is invalid
        if (e.target.value === "") {
            SetOnInvalid(false);
            if (e.target.value > 1000) {
                sendSpeedToSocket(1000);

            } else {
                sendSpeedToSocket(e.target.value);
            }
        } else if (!validNumber.test(e.target.value)) {
            SetOnInvalid(true);
        } else {
            SetOnInvalid(false);
            if (e.target.value > 1000) {
                sendSpeedToSocket(1000);
            } else {
                sendSpeedToSocket(e.target.value);
            }
        }
    };

    function sendSpeedToSocket(newSpeed) {
        let newSpeedNum = 0
        if (typeof newSpeed === 'string')
            newSpeedNum = parseInt(newSpeed)
        socket.emit("setMotorSpeed", device.jarName, device.name, device.deviceGroup, newSpeedNum, (data) => {
            if (data["status"] === "error") {
                console.log("sendSpeedToSocket error:", data["errorMessage"])
                notifyBad(data["errorMessage"])
            }
        })
    }

    return (
        <div className="motor-panel">
            <div className="control-subject small-subject">Motor</div>

            <div className="status">Status</div>
            <div className="status-container">
                {device.speed}
                <div>&nbsp;&nbsp;RPM</div>
            </div>
            <div className="status">Custom</div>
            <div className="status-container">
                <input
                    className="range-input"
                    type="range"
                    min="0"
                    max="1000"
                    link-to="motor-manual-input"
                    value={device.speed}
                    onInput={handleChange}
                ></input>
                <input
                    type="text"
                    id="motor-manual-input"
                    value={device.speed}
                    onChange={handleChange}
                ></input>
                <button type="button" className="apply">
                    <FaShare className="rotate"/>
                </button>
            </div>
            {onInvalid && <InvalidMessage/>}
        </div>
    );
};

export default MotorPanel;
