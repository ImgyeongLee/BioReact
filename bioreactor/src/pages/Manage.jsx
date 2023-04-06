import React, {useState} from "react";
import Sidebar from "../components/Sidebar";
import RecipePanel from "../components/RecipePanel";
import AddForm from "../components/AddForm";
import EditForm from "../components/EditForm";
import DeleteWarning from "../components/DeleteWarning";
import {NavLink} from "react-router-dom";
import {FaAngleLeft} from "react-icons/fa";
import {useDispatch, useSelector} from "react-redux";
import {getRecipe} from "../redux/selectors";
import {socket} from "../context/socket";
import {selectRecipe} from "../redux/actions";

function Manage(){
    const dispatch = useDispatch()
    const [onAdd, setOnAdd] = useState(false);
    const [onEdit, setOnEdit] = useState(false);
    const [onDelete, setOnDelete] = useState(false);

    const onAddRecipe = () => {
        setOnAdd(true);
        dispatch(selectRecipe({
            name: "",
            time: undefined,
            motorSpeed: undefined,
            temperature: undefined,
            ingredients: undefined,
        }))
    };
    const onEditHandler = () => {
        setOnEdit(!onEdit);
    };
    const onDeleteHandler = () => {
        setOnDelete(!onDelete);
    };

    const selectedRecipe = useSelector(getRecipe);

    console.log(selectedRecipe);
    if (selectedRecipe) {
        console.log("NO");
    }

    return (
        <div className="manage-page">
            <Sidebar onAddRecipe={onAddRecipe} socket={socket}/>
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
            <div className="rightside">
                <div className="back-container">
                    <NavLink to="/" className="back">
                        <FaAngleLeft className="arrow"/>
                        Back
                    </NavLink>
                </div>
                {selectedRecipe && (
                    <div className="recipe-panel">
                        <RecipePanel
                            onClickEdit={onEditHandler}
                            onClickDelete={onDeleteHandler}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Manage;
