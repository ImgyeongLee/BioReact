import React from "react";
import {useNavigate} from "react-router-dom";
import {socket} from "../context/socket";
import {notifyBad} from "../notify";

const Summary = ({onClickHandler, recipe, jarName}) => {
    const navigate = useNavigate();

    const loadRecipe = () => {
        socket.emit("loadRecipe", recipe.name, jarName, (data) => {
            if (data["status"] === "error") {
                notifyBad(data["errorMessage"])
            }
        });
        navigate("main");
    };

    return (
        <div className="summary-modal">
            <div className="modal-title">Summary</div>
            <div className="summary-container">
                <div className="left-summary">
                    <div className="recipe-name">Recipe Name: {recipe.name}</div>
                    <hr/>
                    <div>Total Time: {recipe.time}</div>
                    <div>Temperature: {recipe.temperature}</div>
                    <div>Motor RPM: {recipe.motorSpeed}</div>
                    <hr/>
                    <div>Required ingredient:</div>
                    <ul>
                        {Object.keys(recipe.ingredients).map((el, idx) => {
                            return <li key={el}>{el}: {Object.values(recipe.ingredients)[idx]} ml</li>
                        })}
                    </ul>
                </div>
                <div className="right-summary">
                    <div>Please check these before start:</div>
                    <hr/>
                    <div className="regular">
                        <div>Make sure your device is ready.</div>
                        <div>Make sure your valves are ready.</div>
                        <div>Make sure your motors are ready.</div>
                        <hr/>
                        <div>Check the amount of the cool water.</div>
                        <div>Prepare all ingredients that you need.</div>
                        <hr/>
                        <div>While your jars are in progress, you cannot control the devices manually.</div>
                        <hr/>
                        <div>If all things are set up, load your recipe.</div>
                    </div>
                </div>
            </div>
            <div className="button-container">
                <button className="form-button submit" onClick={loadRecipe}>
                    Done
                </button>
                <button className="form-button cancel" onClick={onClickHandler}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default Summary;
