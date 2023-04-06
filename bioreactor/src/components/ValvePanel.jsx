import React from "react";
import ValveControl from "./ValveControl";

const ValvePanel = ({valves}) => {
    return (
        <div className="valve-panel">
            <div className="control-subject small-subject">Valves</div>
            <ul>
                {valves.map(valve =>
                    <ValveControl key={valve.name} valve={valve}/>
                )}
            </ul>
        </div>
    );
};

export default ValvePanel;
