import React, {useEffect, useState} from "react";
import {validNumber} from "../data/regex";
import InvalidMessage from "./InvalidMessage";

const IngredientInput = ({
                             setIngredient,
                             index,
                             removeIngredient,
                             ingredientNameValue,
                             ingredientAmountValue,
                             possibleIngredients,
                         }) => {
    const [onInvalid, SetOnInvalid] = useState(false);
    const [nameValue, setNameValue] = useState(ingredientNameValue.length < 1 ? possibleIngredients[0] : ingredientNameValue);
    const [amountValue, setAmountValue] = useState(ingredientAmountValue);


    useEffect(() => {
        setIngredient(index, nameValue, parseInt(amountValue));
    }, [nameValue, amountValue])

    const handleChange = (e) => {
        // If the input is valid
        if (e.target.value === "") {
            SetOnInvalid(false);
            setAmountValue(e.target.value);
        } else if (!validNumber.test(e.target.value)) {
            SetOnInvalid(true);
        } else {
            SetOnInvalid(false);
            setAmountValue(e.target.value);
        }
    };

    const onChangeHandler = (e) => {
        //e.preventDefault();
        console.log("YOUR INPUT IS ", e.target.value);
        setNameValue(e.target.value);
    };

    const onRemoveHandler = (e) => {
        removeIngredient(e, index);
    };

    return (
        <>
            <div className="ingredient-input-container">
                <div className="order-box">{index + 1}</div>
                <select value={nameValue} onChange={onChangeHandler} required={true} className="wide-ingredient-input">
                    {possibleIngredients.map(ingredient => {
                        return <option key={ingredient} value={ingredient}>{ingredient}</option>
                    })}
                </select>

                <input
                    type="text"
                    required
                    name="amount"
                    className="wide-amount-input"
                    placeholder="Amount"
                    onInput={handleChange}
                    value={amountValue}
                />
                <button onClick={onRemoveHandler} className="remove-button">Remove</button>
            </div>
            {onInvalid && <InvalidMessage/>}
        </>
    );
};

export default IngredientInput;
