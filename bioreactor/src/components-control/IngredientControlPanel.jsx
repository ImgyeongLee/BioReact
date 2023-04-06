import React from "react";
import MotorPanel from "../components/MotorPanel";

const IngredientControlPanel = ({jar}) => {
    // if (!finalJars[0]) {
    //   return;
    // }

    // console.log("FinalJars == ", finalJars);

    return (
        <section className="control-panel-card">
            <div className="control-subject">{jar.jarName}</div>
            <MotorPanel device={jar}/>
        </section>
    );
};

export default IngredientControlPanel;
