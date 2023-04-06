import React from 'react';
import {css} from '@emotion/css'
import {useDispatch} from "react-redux";

function SensorDevice(props) {
    const dispatch = useDispatch()

    function handleSetSensorValue(event) {
        let newValue = event.target.value
        dispatch({
            "type": "UPDATE_SENSOR_VALUE",
            "deviceGroup": props.device.deviceGroup,
            "newValue": newValue,
            "jarName": props.device.jarName
        })
        props.socket.emit("setSensor", props.device.jarName, props.device.deviceGroup, event.target.value, (data) => {
            if (data["status"] === "ok") {
                console.log("sensor ", props.device.name, " of ", props.device.jarName, " changed to value ", newValue)
            } else {
                console.log("setSensor error: ", data["errorMessage"])
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
            <input type={'range'} min={0} max={1000} value={props.device.value} onInput={handleSetSensorValue}/>
            <input type={'number'} min={0} max={1000} value={props.device.value} onInput={handleSetSensorValue}/>
        </div>
    );
}

export default SensorDevice;