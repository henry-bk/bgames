import React from "react";
import CenterComponent from "../../../common/CenterComponent";

const styles = {
  p1: {
    position: "absolute",
    left: "5%",
    top: "70%",
  },
  p2: {
    position: "absolute",
    right: "5%",
    top: "70%",
  },

  p3: {
    position: "absolute",
    right: "47.5%",
    top: "25%",
  },

  p4: {
    position: "absolute",
    left: "30.8%",
    top: "25%",
  },
  p5: {
    position: "absolute",
    right: "30.8%",
    top: "25%",
  },
  life: {
    width: "7vh",
    height: "7vh",
    borderRadius: "7vh",
    boxSizing: "border-box",
    marginRight: "2vh",
    color: "#ffffff",
    fontSize: "4vh",
    fontWeight: "bold",
    border: "2px solid #ffffff",
  },
  cardCount: {
    width: "7vh",
    height: "7vh",
    borderRadius: "7vh",
    boxSizing: "border-box",
    backgroundColor: "#181718",
    color: "#ffffff",
    fontSize: "4vh",
    fontWeight: "bold",
    border: "2px solid #ffffff",
  },
};

export const getPlayerList = (data) => {
  const { players, myIndex, turn } = data;
  let p;
  if (players.length === 3) {
    p = [
      <Player
        key={"player1"}
        style={styles.p1}
        playerData={players[(myIndex + 1) % players.length]}
        turn={(myIndex + 1) % players.length === turn}
      />,
      <Player
        key={"player2"}
        style={styles.p2}
        playerData={players[(myIndex + 2) % players.length]}
        turn={(myIndex + 2) % players.length === turn}
      />,
    ];
  } else if (players.length === 4) {
    p = [
      <Player
        key={"player1"}
        style={styles.p1}
        playerData={players[(myIndex + 1) % players.length]}
        turn={(myIndex + 1) % players.length === turn}
      />,
      <Player
        key={"player2"}
        style={styles.p3}
        playerData={players[(myIndex + 2) % players.length]}
        turn={(myIndex + 2) % players.length === turn}
      />,
      <Player
        key={"player3"}
        style={styles.p2}
        playerData={players[(myIndex + 3) % players.length]}
        turn={(myIndex + 3) % players.length === turn}
      />,
    ];
  } else if (players.length === 5) {
    p = [
      <Player
        key={"player1"}
        style={styles.p1}
        playerData={players[(myIndex + 1) % players.length]}
        turn={(myIndex + 1) % players.length === turn}
      />,
      <Player
        key={"player2"}
        style={styles.p4}
        playerData={players[(myIndex + 2) % players.length]}
        turn={(myIndex + 2) % players.length === turn}
      />,
      <Player
        key={"player3"}
        style={styles.p5}
        playerData={players[(myIndex + 3) % players.length]}
        turn={(myIndex + 3) % players.length === turn}
      />,
      <Player
        key={"player4"}
        style={styles.p2}
        playerData={players[(myIndex + 4) % players.length]}
        turn={(myIndex + 4) % players.length === turn}
      />,
    ];
  }

  return p;
};

const Player = ({ style, playerData, turn }) => {
  return (
    <div
      style={{
        ...style,
        width: "5vh",
        height: "5vh",
        borderRadius: "5vh",
        backgroundColor: "#000000",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div style={{ position: "absolute", top: "5vh", left: "-5.5vh" }}>
          <PData {...playerData} turn={turn} />
        </div>
      </div>
    </div>
  );
};

export const PData = ({ id, life, cardCount, turn }) => {
  return (
    <CenterComponent column full>
      <span
        style={{
          height: "1.5em",
          overflow: "hidden",
          color: turn && "#ffffff",
        }}
      >
        {id.slice(0, 10)}
      </span>
      <CenterComponent full>
        <div
          style={{
            ...styles.life,
            backgroundColor: life < 15 ? "#dd8888" : "#88dd88",
          }}
        >
          <CenterComponent full>{life}</CenterComponent>
        </div>
        <div style={styles.cardCount}>
          <CenterComponent full>{cardCount}</CenterComponent>
        </div>
      </CenterComponent>
    </CenterComponent>
  );
};
