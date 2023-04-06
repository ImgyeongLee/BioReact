import React from "react";
import {socket} from "../context/socket";
import "react-toastify/dist/ReactToastify.css";
import {notifyBad, notifyGood} from "../notify";
import {selectRecipe} from "../redux/actions";
import {useDispatch} from "react-redux";

const DeleteWarning = ({onClickHandler, setOnDelete, selectedRecipe}) => {
    const dispatch = useDispatch();
    const onClickRemoveHandler = () => {
        socket.emit("removeRecipe", selectedRecipe.name, (data) => {
            if (data["status"] === "error") {
                notifyBad(data["errorMessage"])
            } else {
                setOnDelete(false);
                notifyGood('Removing recipe went successful!')
                dispatch(selectRecipe({
                    name: "",
                    time: undefined,
                    motorSpeed: undefined,
                    temperature: undefined,
                    ingredients: undefined,
                }))
            }
        })
    }

    return (
        <div className="warn-container">
            <div className="form-title">Delete</div>
            <div className="subject margin-bottom-more">
                Do you really want to delete this recipe?
            </div>
            <div>
                <button className="form-button submit" onClick={onClickRemoveHandler}>Yes</button>
                <button className="form-button cancel" onClick={onClickHandler}>
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default DeleteWarning;
