import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {getRecipe} from "../redux/selectors";
import Ingredients from "./Ingredients";
import {socket} from "../context/socket";
import "react-toastify/dist/ReactToastify.css";
import {selectRecipe} from "../redux/actions";
import {notifyBad, notifyGood} from "../notify";
import {validNumber} from "../data/regex";

const EditForm = ({setOnEdit}) => {
    const dispatch = useDispatch()
    const selectedRecipe = useSelector(getRecipe);
    console.log("names:", selectedRecipe)

    const onSubmitHandler = (e) => {
        e.preventDefault();
        // formValue.ingredients = arrayToObject(ingredientNames, ingredientAmounts);
        console.log(selectedRecipe);
        socket.emit("setRecipe", selectedRecipe, (data) => {
            if (data["status"] === "error") {
                notifyBad(data["errorMessage"])
            } else {
                setOnEdit(false)
                notifyGood("Editing recipe went successful!")
            }
        });
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
                <div className="form-title">Edit your recipe</div>
                <label>
                    <div className="subject">
                        Recipe Name<span className="required"> *</span>
                    </div>
                    <p>{selectedRecipe.name}</p>
                    {/*<input*/}
                    {/*  required*/}
                    {/*  type="text"*/}
                    {/*  name="name"*/}
                    {/*  value={formValue.name}*/}
                    {/*  className="general-text-input"*/}
                    {/*/>*/}
                </label>
                <label>
                    <div className="subject">
                        Required Time<span className="required"> *</span>
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
                                time: testNumber(e.target.value)
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
                                temperature: testNumber(e.target.value)
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
                        name="rpm"
                        className="general-text-input"
                        value={selectedRecipe.motorSpeed}
                        onChange={(e) => {
                            e.preventDefault();
                            dispatch(selectRecipe({
                                ...selectedRecipe,
                                motorSpeed: testNumber(e.target.value)
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
                    <input type="submit" value="Edit" className="form-button submit"/>
                    <button
                        type="button"
                        className="form-button cancel"
                        onClick={() => {
                            setOnEdit(false)
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </>
    );
};

export default EditForm;
