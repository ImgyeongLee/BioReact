import React from 'react';
import {css} from "@emotion/css";
import {useDispatch} from "react-redux";

function ValveDevice(props) {
    const dispatch = useDispatch()

    function handleValveToggle() {
        let newState = props.device.opened
        dispatch({
            "type": "UPDATE_VALVE",
            "deviceGroup": props.device.deviceGroup,
            "jarName": props.device.jarName,
            "opened": !newState,
            "name": props.device.name
        })
        props.socket.emit("toggleValve", props.device.jarName, props.device.name, props.device.deviceGroup, !newState, (data) => {
            if (data["status"] === "ok") {
                console.log("valve ", props.device.name, " of ", props.device.jarName, " changed to state ", !newState)
            } else {
                console.log("toggleValve error: ", data["errorMessage"])
            }
        })
    }

    return (
        <div className={css`
          border: 2px #FBFBFB solid;
          border-radius: 10px;
          width: 200px;
          height: 200px;
          margin: 5px;
          padding: 5px;`}>
            <h4>{props.device.name}</h4>
            <button onClick={handleValveToggle}>{props.device.opened ? "Open valve" : "Close valve"}</button>
        </div>
    );
}

export default ValveDevice;