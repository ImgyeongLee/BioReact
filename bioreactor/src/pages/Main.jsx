import React, {useState} from "react";
import {useSelector} from "react-redux";
import {getLocalStatus} from "../redux/selectors";
import Jar from "../components/Jar";
import {socket} from "../context/socket";

const Main = () => {
    const deviceStatus = useSelector(getLocalStatus);
    const [onRecipe, setOnRecipe] = useState(false);
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
                deviceStatus.finalJars.map((jar) => {
                    socket.emit("cancelRecipe", jar.name)
                    console.log("CANCEL")
                })
            }
            }>STOP</button>
        </div>
    );
};

export default Main;
