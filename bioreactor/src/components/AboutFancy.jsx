import React from "react";
import MovingText from "react-moving-text";
import {NavLink, useNavigate} from "react-router-dom";

const AboutFancy = ({lang}) => {
    const navigate = useNavigate();

    return (
        <div className="fancy-container">
            <div className="fancy-paragraph">
                <MovingText
                    className="fancy-main"
                    type="fadeInFromBottom"
                    duration="1000ms"
                    delay="0s"
                    direction="normal"
                    timing="ease"
                    iteration="1"
                    fillMode="none"
                >
                    {lang === "kr" && ("Bioreact가 무엇입니까?")}
                    {lang !== "kr" && ("What is Bioreactor?")}
                </MovingText>
            </div>
            <MovingText
                className="fancy-text"
                type="fadeInFromBottom"
                duration="1000ms"
                delay="0s"
                direction="normal"
                timing="ease"
                iteration="1"
                fillMode="none"
            >
                {lang === "kr" && ("Bioreactor는 raspberry pi 머신을 조종하기 위해 만들어진, socket.io를 이용한 " +
                    "웹 어플리케이션입니다.")}
                {lang !== "kr" && ("Bioreactor is a web application that can handle a raspberry pi machine\n" +
                    "                by using socket.io")}
            </MovingText>
            <br/>
            <br/>
            <MovingText
                className="fancy-text"
                type="fadeInFromBottom"
                duration="1000ms"
                delay="0s"
                direction="normal"
                timing="ease"
                iteration="1"
                fillMode="none"
            >
                {lang === "kr" && ("이 어플리케이션은 아래의 사람들이 참여하였습니다:")}
                {lang !== "kr" && ("This application is implemented by following people:")}
            </MovingText>
            <br/>
            <MovingText
                className="fancy-text"
                type="fadeInFromBottom"
                duration="1000ms"
                delay="0s"
                direction="normal"
                timing="ease"
                iteration="1"
                fillMode="none"
            >
                Frank Nguyen &#40;Backend&#41;
            </MovingText>
            <MovingText
                className="fancy-text"
                type="fadeInFromBottom"
                duration="1000ms"
                delay="0s"
                direction="normal"
                timing="ease"
                iteration="1"
                fillMode="none"
            >
                Imgyeong Lee &#40;Frontend&#41;
            </MovingText>
            {lang === "kr" && <div className="link-margin"><NavLink to="/about">영어로 이 페이지를 보기</NavLink></div>}
            {lang !== "kr" &&
                <div className="link-margin"><NavLink to="/about/kr">See this page in Korean</NavLink></div>}
        </div>
    );
};

export default AboutFancy;
