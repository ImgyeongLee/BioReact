import React, {useEffect, useState} from 'react';
import {css} from "@emotion/css";

function RecipeInput({socket, allRecipes, setAllRecipes}) {
    const [enteredJSON, setEnteredJSON] = useState("")
    const [returnedRecipe, setReturnedRecipe] = useState({});
    const [removingRecipe, setRemovingRecipe] = useState("")


    useEffect(()=>{
        socket.emit("getRecipeList", (data) => {
            setAllRecipes(data["list"])
        })
    }, [])

    function readFileContent(file) {
        const reader = new FileReader()
        return new Promise((resolve, reject) => {
            reader.onload = event => resolve(event.target.result)
            reader.onerror = error => reject(error)
            reader.readAsText(file)
        })
    }

    function fileChangeHandler(event) {
        readFileContent(event.target.files[0]).then(content => {
            setEnteredJSON(content)
        })
    }

    function textChangeHandler(event){
        setEnteredJSON(event.target.value)
    }

    function setRecipe(){
        setReturnedRecipe({})
        console.log(enteredJSON)

        if(enteredJSON.length < 1){
            console.log("No recipe to submit")
            return
        }

        let payload = JSON.parse(enteredJSON)

        socket.emit("setRecipe", payload, (data)=>{
            if(data["status"] === "error"){
                console.log("setRecipe error:", data["errorMessage"])
                return
            }
            console.log("recipe submitted, testing requesting")
            socket.emit("getRecipe", payload["name"], (data) => {
                if(data["status"] === "error"){
                    console.log("getRecipe error:", data["errorMessage"])
                    return
                }
                console.log("recipe returned:", data["recipe"])
                setReturnedRecipe(data["recipe"])
            })
        })

        socket.emit("getRecipeList", (data) => {
            setAllRecipes(data["list"])
        })

        setEnteredJSON("")
    }

    function removeRecipe(){
        socket.emit("removeRecipe", removingRecipe, (data)=>{
            if(data["status"] === "error"){
                console.log("removeRecipe error:", data["errorMessage"])
                return
            }
            socket.emit("getRecipeList", (data) => {
                setAllRecipes(data["list"])
            })
        })
        setRemovingRecipe("")
    }

    return (
        <div className={css`display: block`}>
            <p>All recipes: {JSON.stringify(allRecipes)}</p>
            <label htmlFor={"recipeRemove"}>Remove recipe:</label>
            <input type={"text"} name="recipeRemove" value={removingRecipe} onChange={(event) => setRemovingRecipe(event.target.value)}/>
            <button onClick={removeRecipe} >Remove recipe</button>
            <input type={"file"} name="recipeFile" accept=".json" onChange={fileChangeHandler}/>
            <textarea value={enteredJSON} rows="4" cols="50" onInput={textChangeHandler}/>
            <button onClick={setRecipe}>Set Recipe</button>
            <p>Returned recipe: {JSON.stringify(returnedRecipe)}</p>
        </div>
    );
}

export default RecipeInput;