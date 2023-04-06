import React from "react";
import styled from "styled-components";
import {BsCheckCircleFill} from "react-icons/bs";
import {TbTemperature} from "react-icons/tb";
import {GiElectric} from "react-icons/gi";
import ProgressPanel from "./ProgressPanel";
import {socket} from "../context/socket";
import {notifyBad, notifyGood} from "../notify";

const ProgressJar = ({status, jar}) => {
    const StyledSpan = styled.span`
      background: ${status};
      color: white;
      width: 100%;
      display: block;
      padding-top: 1em;
      padding-bottom: 1em;
      border-top-right-radius: 0.8em;
      border-top-left-radius: 0.8em;
      font-weight: bold;
      font-size: 1.1em;
    `;

    return (
        <>
            <div className="on-recipe jar">
                <StyledSpan className="status-center">
                    <BsCheckCircleFill className="span-icon"/>
                    {jar.name}&nbsp;&#40;{jar.recipe.name}&#41;
                </StyledSpan>
                <div className="status-span">
          <span className="temperature">
            <TbTemperature className="status-temp-icon"/>
              {jar.tempProbe.value} °F
          </span>
                    <span className="rpm">
            <GiElectric className="status-rpm-icon"/>
            RPM {jar.impellerMotor.speed}
          </span>
                </div>
                <ProgressPanel jar={jar}/>
            </div>
            <span className={"cancelBtn"}>
            </span>
        </>
    );
};

export default ProgressJar;
