import React from "react";
import EmptyJar from "./EmptyJar";
import ProgressJar from "./ProgressJar";
import color from "../data/color.json";

const Jar = ({jar}) => {
    if (!jar) {
        return;
    }

    return (
        <>
            {!jar.recipe && <EmptyJar jarName={jar.name}/>}
            {jar.recipe && jar.state === "idle" && <ProgressJar status={"#273333"} jar={jar}/>}
            {jar.recipe && jar.state === "incubationPrep" && <ProgressJar status={color.success} jar={jar}/>}
            {jar.recipe && jar.state === "paused" && <ProgressJar status={color.loading} jar={jar}/>}
            {jar.recipe && jar.state === "running" && <ProgressJar status={color.success} jar={jar}/>}
        </>
    );
};

export default Jar;
