import React from 'react';
import {css} from '@emotion/css'
import {useDispatch} from "react-redux";

function MotorDevice(props) {
    const dispatch = useDispatch()

    function handleSetMotorSpeed(event) {
        dispatch({
            "type": "UPDATE_MOTOR_SPEED",
            "deviceGroup": props.device.deviceGroup,
            "newSpeed": event.target.value,
            "jarName": props.device.jarName
        })
        props.socket.emit("setMotorSpeed", props.device.jarName, props.device.name, props.device.deviceGroup, event.target.value, (data) => {
            if (data["status"] === "ok") {
                console.log("motor ", props.device.name, " of ", props.device.jarName, " changed to speed ", data["newSpeed"])
            } else {
                console.log("setMotorSpeed error: ", data["errorMessage"])
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
            <input type={'range'} min={0} max={1000} value={props.device.speed} onInput={handleSetMotorSpeed}/>
            <p>RPM: {props.device.speed}</p>
        </div>
    );
}

export default MotorDevice;