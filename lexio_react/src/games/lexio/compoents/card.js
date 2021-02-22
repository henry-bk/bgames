import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useDispatch } from "react-redux";
import { selectCard } from "../lexioActions";
import CenterComponent from "../../../common/CenterComponent";

const styles = {
  cardBody: ({ type, index, selected, lexioTheme, anim, dim }) => ({
    position: "relative",
    width: "6.5%",
    height: "18vh",
    backgroundColor: dim ? lexioTheme.dimColor : lexioTheme.blockColor,
    color: lexioTheme.colors[type],
    borderRadius: "1vh",
    boxSizing: "border-box",
    fontSize: "3.5vh",
    fontWeight: "bold",
    marginRight: "1%",
    textAlign: "right",
    padding: "1vh",
    boxShadow: "0.2vh 0.2vh 0.5vh #000000",
    border: "1px #bdbdbd solid",
    animation: anim && `fadeUp 0.3s ${0.015 * index}s`,
    transform: selected && "translateY(-5vh)",
    transition: "all .3s",
    overflow: "hidden",
  }),
  num: {
    position: "absolute",
    top: "1vh",
    right: "1vh",
  },
  shape: ({ lexioTheme, type }) => ({
    position: "absolute",
    width: "10vh",
    height: "10vh",
    top: "-1vh",
    right: "-1.5vh",
    borderRadius: "10vh",
    backgroundColor: lexioTheme.colors[type] + "99",
  }),
  shape2: ({ lexioTheme, type }) => ({
    position: "absolute",
    width: "5vh",
    height: "5vh",
    bottom: "1vh",
    left: "0.5vh",
    borderRadius: "5vh",
    backgroundColor: lexioTheme.colors[type] + "99",
  }),
};
const useStyles = makeStyles(styles);

const Card = ({ type, number, selected, index, anim, dim }) => {
  const { lexioTheme } = useTheme();
  const classes = useStyles({ type, index, lexioTheme, selected, anim, dim });
  const dispatch = useDispatch();
  const onClick = React.useCallback(() => {
    dispatch(selectCard(index));
  }, [index]);
  return (
    <div className={classes.cardBody} onClick={onClick}>
      <div className={classes.shape}>
        <CenterComponent full>
          <div
            style={{
              width: "8.5vh",
              height: "8.5vh",
              borderRadius: "8.5vh",
              backgroundColor: lexioTheme.blockColor,
            }}
          ></div>
        </CenterComponent>
      </div>
      <span className={classes.num}>{number}</span>

      <div className={classes.shape2} />
    </div>
  );
};

export default Card;
