import React, {useEffect, useState} from "react";
import {FaSearch} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {selectRecipe} from "../redux/actions";
import {getRecipeList} from "../redux/selectors";

const Sidebar = ({onAddRecipe}) => {
    const dispatch = useDispatch();
    const recipeList = useSelector(getRecipeList)
    const [result, setResult] = useState([])
    const [filterText, setFilterText] = useState("")

    useEffect(() => {
        let recipeListToValues = Object.values(recipeList)
        setResult(recipeListToValues)
        if (filterText === "") {
            setResult(recipeListToValues)
            return
        }
        setResult(recipeListToValues.filter(data => data.name.toLowerCase().includes(filterText)))
    }, [filterText, recipeList])

    const onChangeHandler = (e) => {
        console.log("onChange")
        e.preventDefault()
        setFilterText(e.target.value.toLowerCase())
    }

    return (
        <div className="sidebar">
            <div className="bold list-header">Recipe List</div>

            <div className="search">
                <input
                    className="searchbox"
                    placeholder="Search recipes..."
                    type="text"
                    value={filterText}
                    onChange={onChangeHandler}
                />
                <button className="searchbutton">
                    <FaSearch/>
                </button>
            </div>
            <div className="recipe-list">
                {!(Object.keys(result).length === 0) && (result.map((data) => {
                    return (
                        <li key={data.name}>
                            <button
                                className="recipe-link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    dispatch(selectRecipe(data));
                                }}
                            >
                                {data.name}
                            </button>
                        </li>
                    );
                }))}

            </div>
            <button className="add-button" onClick={()=>{
                onAddRecipe()
                dispatch(selectRecipe({
                    name: "",
                    time: undefined,
                    motorSpeed: undefined,
                    temperature: undefined,
                    ingredients: undefined,
                }))}}>
                + Add Recipe
            </button>
        </div>
    );
};

export default Sidebar;
