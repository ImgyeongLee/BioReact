import React from "react";
import styled from "styled-components";
import color from "../data/color.json";

const StyledButton = styled.button`
  background: ${color.selectbutton};
  color: ${color.maintext};
  cursor: pointer;
  border-radius: 0.8em;
  width: 12em;
  padding: 1.5em 2.5em;
  font-size: 16px;
  font-weight: bold;
  border: none;
  transition-duration: 0.3s;

  &:hover {
    background-color: #026661;
    color: white;
  }

  &:active {
    color: ${color.prettygray};
  }
`;

function Button({children, ...rest}) {
    return <StyledButton {...rest}>{children}</StyledButton>;
}

export default Button;
