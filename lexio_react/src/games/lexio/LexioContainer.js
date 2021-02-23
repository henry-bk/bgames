import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { useLexioLogics } from "./lexioLogics";

import CenterComponent from "../../common/CenterComponent";
import Card from "./compoents/card";

import { getPlayerList, PData } from "./compoents/player";

const styles = {
  "@global": {
    "@keyframes fadeUp": {
      "0%": {
        opacity: 0,
        transform: "translateY(20px)",
      },
      "100%": {
        opacity: 1,
        transform: "translateY(0px)",
      },
    },
  },
  myDeckContainer: {
    position: "absolute",
    width: "100%",
    height: "25%",
    bottom: "3vh",
  },
  ready: {
    top: 0,
    width: "100%",
    height: "100%",
    fontSize: 100,
    color: "#bdbdbd",
    backgroundColor: "#444444",
    cursor: "default",
  },
  players: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: "50%",
  },
  container: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  myId: ({ myTurn }) => ({
    position: "absolute",
    top: "-10vh",
    color: myTurn && "#FFFFFF",
  }),
  buttonContainer: {
    position: "absolute",
    top: "3vh",
    right: 0,
  },
  button: {
    width: "7vh",
    height: "7vh",
    borderRadius: "7vh",
    marginRight: "3vh",
    backgroundColor: "#ffffff",
  },
};

const useStyles = makeStyles(styles);

const LexioContainer = (props) => {
  const { gameContainer } = useTheme();
  const {
    data: { cards, myIndex, players, turn, money, floor },
    waiting,
    showReady,
    showRefresh,
    onReady,
    skipTurn,
    canSubmit,
    submitCards,
  } = useLexioLogics();
  const myTurn = !waiting && turn === myIndex;
  const classes = useStyles({ myTurn });

  return (
    <div style={gameContainer}>
      {floor && (
        <div
          style={{
            width: "100%",
            height: "100%",
            transform: "perspective(50vh) rotateX(15deg) translateY(-20vh)",
          }}
        >
          <CenterComponent column full>
            {floor.slice(-6).map((cards, fi) => (
              <CenterComponent
                key={"floor_" + fi}
                full
                style={{ height: "10vh" }}
              >
                {cards.map((card, index) => (
                  <Card
                    key={"floor" + card.type + "-" + card.number}
                    {...card}
                    index={index}
                    dim={fi !== floor.slice(-6).length - 1}
                  />
                ))}
              </CenterComponent>
            ))}
          </CenterComponent>
        </div>
      )}
      {players && (
        <div className={classes.players}>
          <div className={classes.container}>
            {getPlayerList({ players, myIndex, turn })}
          </div>
        </div>
      )}
      {cards && (
        <>
          <div className={classes.myDeckContainer}>
            <CenterComponent full>
              {players && (
                <div className={classes.myId}>
                  <PData {...players[myIndex]} turn={myTurn} />
                </div>
              )}
              {cards.map((card, index) => (
                <Card
                  key={card.type + "-" + card.number}
                  {...card}
                  index={index}
                  anim
                />
              ))}
            </CenterComponent>
          </div>
          {myTurn && (
            <div className={classes.buttonContainer}>
              <CenterComponent>
                {canSubmit && (
                  <div
                    key={"submit"}
                    className={classes.button}
                    onClick={submitCards}
                  >
                    <CenterComponent full>submit</CenterComponent>
                  </div>
                )}
                {floor && floor.length > 0 && (
                  <div
                    key={"skip"}
                    className={classes.button}
                    onClick={skipTurn}
                  >
                    <CenterComponent full>skip</CenterComponent>
                  </div>
                )}
              </CenterComponent>
            </div>
          )}
        </>
      )}
      {showReady && (
        <div className={classes.ready} onClick={onReady}>
          <CenterComponent full>Ready?</CenterComponent>
        </div>
      )}
      {showRefresh && (
        <div className={classes.ready} onClick={onReady}>
          <CenterComponent full>
            Refresh the browser to restart the Game!
          </CenterComponent>
        </div>
      )}
    </div>
  );
};

export default LexioContainer;
