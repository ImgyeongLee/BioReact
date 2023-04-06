import React from "react";
import styled from "styled-components";
import color from "../data/color.json";

const Message = styled.div`
  background: transparent;
  color: ${color.warning};
  border-radius: 1em;
  padding: 0.8em;
  border: 1px solid ${color.border};
`;

const Error = styled.div`
  background: transparent;
  color: ${color.warning};
  font-weight: bold;
`;

function ErrorMessage({children, ...rest}) {
    return (
        <Message {...rest}>
            <Error>Something went wrong</Error>
            {children}
        </Message>
    );
}

export default ErrorMessage;
