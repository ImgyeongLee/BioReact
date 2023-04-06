import React from "react";
import IngredientInput from "./IngredientInput";
import {useDispatch, useSelector} from "react-redux";
import {selectRecipe} from "../redux/actions";
import {getLocalStatus, getRecipe} from "../redux/selectors";

const Ingredients = () => {
    const dispatch = useDispatch();

    // I was trying to map all ingredients for edit form.
    // const [state, setState] = useState([]);
    // const [amounts, setAmounts] = useState([]);
    // const state = useSelector(getIngredientNames)
    // const amounts = useSelector(getIngredientAmounts)

    const machineStatus = useSelector(getLocalStatus)
    const possibleIngredients = machineStatus["startJars"].map(startJar => startJar["jarName"])

    const selectedRecipe = useSelector(getRecipe)
    let ingredientNameList = []
    let ingredientValueList = []
    if (selectedRecipe["ingredients"] !== null && selectedRecipe["ingredients"] !== undefined) {
        ingredientNameList = Object.keys(selectedRecipe["ingredients"])
        ingredientValueList = Object.values(selectedRecipe["ingredients"])
    }

    // if(recipe){
    //   setState(Object.keys(recipe))
    //   setAmounts(Object.values(recipe))
    // }

    const addIngredient = () => {
        // setState([...state, ""]);
        dispatch(selectRecipe({
            ...selectedRecipe,
            "ingredients": {
                ...selectedRecipe["ingredients"],
                "": 0
            }
        }))
        // selectNames([...state, ""])
        // setAmount([...amounts, ""]);
    };

    // Remove

    const removeIngredient = (e, idx) => {
        e.preventDefault();

        const result = [];

        for (let i = 0; i < ingredientNameList.length; i++) {
            if (i !== idx) {
                result.push(selectedRecipe["ingredients"][ingredientNameList[i]]);
            }
        }
        dispatch(selectRecipe({
            ...selectedRecipe,
            "ingredients": {
                ...Object.fromEntries(result)
            }
        }))
        // selectAmounts(result)
        // setAmounts(result);
    }

    const setIngredient = (idx, name, value) => {
        const result = [];

        for (let i = 0; i < ingredientNameList.length; i++) {
            if (i !== idx) {
                result.push([
                    ingredientNameList[i], ingredientValueList[i]
                ]);
            } else {
                result.push([
                    name, value
                ])
            }
        }
        console.log("RESULT:", selectedRecipe["ingredients"])
        dispatch(selectRecipe({
            ...selectedRecipe,
            "ingredients": {
                ...Object.fromEntries(result)
            }
        }))
        // let temp = state;
        // temp[idx] = value;
        // // setState(temp);
        // selectNames(temp)
    };

    return (
        <div className="ingredient-container">
            {ingredientNameList.map((el, index) => {

                return (
                    <IngredientInput
                        setIngredient={setIngredient}
                        index={index}
                        removeIngredient={removeIngredient}
                        ingredientNameValue={ingredientNameList[index]}
                        ingredientAmountValue={ingredientValueList[index]}
                        possibleIngredients={possibleIngredients}
                    />
                );
            })}
            <button
                className="add-ingredient"
                type="button"
                onClick={(e) => {
                    e.preventDefault();
                    addIngredient();
                }}
            >
                +
            </button>
        </div>
    );
};

export default Ingredients;
