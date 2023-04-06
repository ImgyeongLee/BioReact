import React, {useState} from "react";
import Sidebar from "../components/Sidebar";
import RecipePanel from "../components/RecipePanel";
import Summary from "../components/Summary";
import AddForm from "../components/AddForm";
import EditForm from "../components/EditForm";
import DeleteWarning from "../components/DeleteWarning";
import {NavLink} from "react-router-dom";
import {FaAngleLeft} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {getJarName, getRecipe} from "../redux/selectors";
import {selectRecipe} from "../redux/actions";

function Selection({socket}){
    const [onSummary, SetOnSummary] = useState(false);
    const [onAdd, setOnAdd] = useState(false);
    const [onEdit, setOnEdit] = useState(false);
    const [onDelete, setOnDelete] = useState(false);

    const onAddRecipe = () => {
        setOnAdd(!onAdd);
    };
    const onEditHandler = () => {
        setOnEdit(!onEdit);
    };
    const onDeleteHandler = () => {
        setOnDelete(!onDelete);
    };

    const onClickSummary = () => {
        SetOnSummary(!onSummary);
    };

    const selectedRecipe = useSelector(getRecipe);
    const selectedJarName = useSelector(getJarName);

    // console.log("HERE IS JAR NAME: ", selectedJarName);

    return (
        <div className="manage-page">
            {onSummary && (
                <>
                    <Summary
                        onClickHandler={onClickSummary}
                        recipe={selectedRecipe}
                        socket={socket}
                        jarName={selectedJarName}
                    />
                    <div className="backscreen"></div>
                </>
            )}
            {onAdd && (
                <>
                    <AddForm setOnAdd={setOnAdd}/>
                    <div className="backscreen"></div>
                </>
            )}
            {onEdit && (
                <>
                    <EditForm setOnEdit={setOnEdit}/>
                    <div className="backscreen"></div>
                </>
            )}
            {onDelete && (
                <>
                    <DeleteWarning onClickHandler={onDeleteHandler} setOnDelete={setOnDelete}
                                   selectedRecipe={selectedRecipe}/>
                    <div className="backscreen"></div>
                </>
            )}
            <Sidebar onAddRecipe={onAddRecipe} socket={socket}/>
            <div className="rightside">
                <div className="back-container">
                    <NavLink to="/" className="back">
                        <FaAngleLeft className="arrow"/>
                        Back
                    </NavLink>
                </div>
                <div className="recipe-panel">
                    {selectedRecipe && (
                        <>
                            <div className="recipe-panel">
                                <RecipePanel
                                    onClickEdit={onEditHandler}
                                    onClickDelete={onDeleteHandler}
                                />
                            </div>
                            <button className="load-button" onClick={onClickSummary}>
                                Load recipe
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Selection;
