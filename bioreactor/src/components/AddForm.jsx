import React from "react";
import Ingredients from "./Ingredients";
import {useDispatch, useSelector} from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import {socket} from "../context/socket";
import {getRecipe} from "../redux/selectors";
import {selectRecipe} from "../redux/actions";
import {notifyBad, notifyGood} from "../notify";
import {validNumber} from "../data/regex";

const AddForm = ({setOnAdd}) => {
    const dispatch = useDispatch()
    const selectedRecipe = useSelector(getRecipe)


    const onSubmitHandler = (e) => {
        e.preventDefault();
        socket.emit("setRecipe", selectedRecipe, (data) => {
            if (data["status"] === "error") {
                notifyBad(data["errorMessage"])
            } else {
                setOnAdd(false);
                notifyGood("Recipe " + selectedRecipe.name + " added!")
            }
        })
    };

    const testNumber = (test) => {
        var num = 0
        if (validNumber.test(test))
            num = parseInt(test)

        return num
    }

    return (
        <>
            <form className="addform" onSubmit={onSubmitHandler}>
                <div className="form-title">Add your recipe</div>
                <label>
                    <div className="subject">
                        Recipe Name<span className="required"> *</span>
                    </div>
                    <input
                        required
                        type="text"
                        name="name"
                        className="general-text-input"
                        value={selectedRecipe.name}
                        onChange={(e) => {
                            e.preventDefault();
                            dispatch(selectRecipe({
                                ...selectedRecipe,
                                name: e.target.value,
                            }))
                        }}
                    />
                </label>
                <label>
                    <div className="subject">
                        Recipe Time<span className="required"> *</span>
                    </div>
                    <input
                        required
                        type="text"
                        name="time"
                        className="general-text-input"
                        value={selectedRecipe.time}
                        onChange={(e) => {
                            e.preventDefault();
                            dispatch(selectRecipe({
                                ...selectedRecipe,
                                time: testNumber(e.target.value),
                            }))
                        }}
                    />
                </label>
                <label>
                    <div className="subject">
                        Required Temperature<span className="required"> *</span>
                    </div>
                    <input
                        required
                        type="text"
                        name="temperature"
                        className="general-text-input"
                        value={selectedRecipe.temperature}
                        onChange={(e) => {
                            e.preventDefault();
                            dispatch(selectRecipe({
                                ...selectedRecipe,
                                temperature: testNumber(e.target.value),
                            }))
                        }}
                    />
                </label>
                <label>
                    <div className="subject">
                        Required Motor RPM<span className="required"> *</span>
                    </div>
                    <input
                        required
                        type="text"
                        name="motorSpeed"
                        className="general-text-input"
                        value={selectedRecipe.motorSpeed}
                        onChange={(e) => {
                            e.preventDefault();
                            dispatch(selectRecipe({
                                ...selectedRecipe,
                                motorSpeed: testNumber(e.target.value),
                            }))
                        }}
                    />
                </label>
                <label>
                    <div className="subject">
                        Required Ingredient<span className="required"> *</span>
                    </div>
                    <Ingredients/>
                </label>
                <div>
                    <input type="submit" value="Submit" className="form-button submit"/>
                    <button
                        type="button"
                        onClick={() => {
                            setOnAdd(false)
                        }}
                        className="form-button cancel"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
};

export default AddForm;
