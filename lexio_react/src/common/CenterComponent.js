import React from "react";

const CenterComponent = (props) => {
  const defaultStyle = {
    width: props.width || "100%",
    height: props.height || "100%",
    display: "flex",
  };
  if (props.full) {
    defaultStyle.alignItems = "center";
    defaultStyle.justifyContent = "center";
  }
  if (props.column) {
    defaultStyle.flexDirection = "column";
  }

  if (props.align) {
    defaultStyle.alignItems = "center";
  }
  if (props.justify) {
    defaultStyle.justifyContent = "center";
  }

  return (
    <div style={{ ...defaultStyle, ...props.style }}>{props.children}</div>
  );
};

export default CenterComponent;
