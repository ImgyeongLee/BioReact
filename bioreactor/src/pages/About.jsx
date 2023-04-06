import React, {useState} from "react";
import MovingText from "react-moving-text";
import {useParams} from "react-router-dom";
import AboutFancy from "../components/AboutFancy";
import handleViewport from "react-in-viewport";

const About = () => {
    const [test, setTest] = useState(false);
    const {lang} = useParams();
    const Block = (props) => {
        const {inViewport, forwardedRef} = props;
        return <div className="viewport-block" ref={forwardedRef}></div>;
    };

    const ViewportBlock = handleViewport(Block);

    const Component = (props) => (
        <ViewportBlock
            onEnterViewport={() => {
                console.log("IN!");
                setTest(true);
            }}
            onLeaveViewport={() => setTest(test)}
        />
    );

    return (
        <div className="about-page">
            <div className="about-card">
                <div className="about">
                    <MovingText
                        type="fadeIn"
                        duration="1000ms"
                        delay="0s"
                        direction="normal"
                        timing="ease"
                        iteration="1"
                        fillMode="none"
                    >
                        BIOREACTOR
                    </MovingText>
                    <div className="about-desc">
                        <MovingText
                            type="fadeIn"
                            duration="1000ms"
                            delay="0s"
                            direction="normal"
                            timing="ease"
                            iteration="1"
                            fillMode="none"
                        >
                            {lang === "kr" && (": 더욱 편한 삶을 위해")}
                            {lang !== "kr" && (": MAKE YOUR LIFE EASIER")}
                        </MovingText>
                    </div>
                </div>
            </div>
            <Component/>
            {test && <AboutFancy lang={lang}/>}
        </div>
    );
};

export default About;
