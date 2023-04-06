import React from "react";
import {useNavigate} from "react-router-dom";
import LoadButton from "./LoadButton";
import {useDispatch} from "react-redux";
import {selectJar} from "../redux/actions";

const EmptyJar = ({jarName}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onClickHandler = () => {
        dispatch(selectJar(jarName));
        navigate("load");
    };

    return (
        <>
            <div className="jar">
                <LoadButton className="loadbutton" onClick={onClickHandler}>
                    Load a recipe
                </LoadButton>
            </div>
        </>
    );
};

export default EmptyJar;
