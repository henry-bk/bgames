import React from "react";

import { useDispatch, useSelector } from "react-redux";
import { deleteCards, syncGame, clearGame } from "./lexioActions";

import io from "socket.io-client";

export const useLexioLogics = () => {
  const dispatch = useDispatch();
  const [socket, setSocket] = React.useState();
  const [showReady, setShowReady] = React.useState();
  const [showRefresh, setShowRefresh] = React.useState();
  const [canSubmit, setCanSubmit] = React.useState(false);
  const [waiting, setWaiting] = React.useState(true);

  React.useEffect(() => {
    setSocket(io("10.114.69.34:8000"));
  }, []);

  React.useEffect(() => {
    if (!socket) {
      return;
    }
    socket.request = (event, data = {}) =>
      new Promise((resolve, reject) => {
        socket.emit(event, data, (data) => {
          if (data && data.error) {
            reject(data.error);
          } else {
            resolve(data);
          }
        });
      });

    socket.on("connect", () => {
      console.log("connected.");
    });
    socket.on("ask ready", () => {
      setShowReady(true);
    });
    socket.on("sync", (data) => {
      dispatch(syncGame(data));
      setWaiting(false);
    });
    socket.on("round finished", () => {
      console.log("finished!");
      setWaiting(true);
    });
    socket.on("game finished", () => {
      console.log("finished!");
      setShowReady(false);
      setShowRefresh(true);
      setCanSubmit(false);
      setWaiting(true);
      dispatch(clearGame());
    });
  }, [socket, dispatch]);

  const data = useSelector(({ lexio }) => lexio);
  const selectedCards =
    data.selectedCards && data.selectedCards.map((i) => data.cards[i]);
  const useCard = data.useCard;
  const { myIndex } = data;
  const floor =
    data.floor !== undefined &&
    data.floor.length &&
    data.floor[data.floor.length - 1];

  React.useEffect(() => {
    if (!floor || !floor.length) {
      if (!selectedCards) {
        setCanSubmit(false);
        return;
      }
      if (selectedCards.length == 1) {
        setCanSubmit(true);
      } else if (selectedCards.length === 2) {
        setCanSubmit(selectedCards[0].number === selectedCards[1].number);
      } else if (selectedCards.length === 3) {
        setCanSubmit(
          selectedCards[0].number === selectedCards[1].number &&
            selectedCards[1].number === selectedCards[2].number
        );
      } else if (selectedCards.length === 5) {
        const data = checkFiveCards(selectedCards, useCard);
        const { isStraight, isFlush, isFullHouse, isFourCard, top } = data;
        if (isStraight || isFlush || isFullHouse || isFourCard) {
          setCanSubmit(true);
        } else {
          setCanSubmit(false);
        }
      } else {
        setCanSubmit(false);
      }
    } else {
      if (!selectedCards || floor.length != selectedCards.length) {
        setCanSubmit(false);
      } else {
        if (floor.length === 1) {
          let f = floor[0].number;
          let m = selectedCards[0].number;
          if (f < 3) f += 100;
          if (m < 3) m += 100;
          if (f < m) {
            setCanSubmit(true);
          } else if (f === m) {
            setCanSubmit(floor[0].type > selectedCards[0].type);
          } else {
            setCanSubmit(false);
          }
        } else if (floor.length === 2) {
          let f = floor[0].number;
          let m = selectedCards[0].number;
          if (f < 3) f += 100;
          if (m < 3) m += 100;
          if (f < m) {
            setCanSubmit(true);
          } else if (f === m) {
            setCanSubmit(
              Math.min(floor[0].type, floor[1].type) >
                Math.min(selectedCards[0].type, selectedCards[1].type)
            );
          } else {
            setCanSubmit(false);
          }
        } else if (floor.length === 3) {
          let f = floor[0].number;
          let m = selectedCards[0].number;
          if (f < 3) f += 100;
          if (m < 3) m += 100;
          setCanSubmit(f < m);
        } else if (floor.length === 5) {
          const myResult = checkFiveCards(selectedCards, useCard);
          const floorResult = checkFiveCards(floor, useCard);

          console.log(myResult, floorResult);
          if (floorResult.isStraight && !floorResult.isFlush) {
            if (myResult.isStraight && !myResult.isFlush) {
              if (floorResult.top < myResult.top) {
                setCanSubmit(true);
              } else if (floorResult.top === myResult.top) {
                setCanSubmit(floorResult.type > myResult.type);
              } else {
                setCanSubmit(false);
              }
            } else if (
              myResult.isFlush ||
              myResult.isFullHouse ||
              myResult.isFourCard ||
              (myResult.isStraight && myResult.isFlush)
            ) {
              setCanSubmit(true);
            } else {
              setCanSubmit(false);
            }
          } else if (floorResult.isFlush) {
            if (myResult.isFlush) {
              if (floorResult.top < myResult.top) {
                setCanSubmit(true);
              } else if (floorResult.top === myResult.top) {
                setCanSubmit(floorResult.type > myResult.type);
              } else {
                setCanSubmit(false);
              }
            } else if (
              myResult.isFullHouse ||
              myResult.isFourCard ||
              (myResult.isStraight && myResult.isFlush)
            ) {
              setCanSubmit(true);
            } else {
              setCanSubmit(false);
            }
          } else if (floorResult.isFullHouse) {
            if (myResult.isFullHouse) {
              setCanSubmit(floorResult.top < myResult.top);
            } else if (
              myResult.isFourCard ||
              (myResult.isStraight && myResult.isFlush)
            ) {
              setCanSubmit(true);
            } else {
              setCanSubmit(false);
            }
          } else if (floorResult.isFourCard) {
            if (myResult.isFourCard) {
              setCanSubmit(floorResult.top < myResult.top);
            } else if (myResult.isStraight && myResult.isFlush) {
              setCanSubmit(true);
            } else {
              setCanSubmit(false);
            }
          } else if (floorResult.isStraight && floorResult.isFlush) {
            if (myResult.isStraight && myResult.isFlush) {
              if (floorResult.top < myResult.top) {
                setCanSubmit(true);
              } else if (floorResult.top === myResult.top) {
                setCanSubmit(floorResult.type > myResult.type);
              } else {
                setCanSubmit(false);
              }
            } else {
              setCanSubmit(false);
            }
          } else {
            console.error("floor has no match.");
          }
        } else {
          setCanSubmit(false);
        }
      }
    }
  }, [selectedCards, floor]);

  const onReady = React.useCallback(() => {
    setShowReady(false);
    socket && socket.emit("ready");
  }, [socket]);

  const skipTurn = React.useCallback(() => {
    socket && socket.emit("skip");
  }, [socket]);

  const submitCards = React.useCallback(() => {
    socket && socket.emit("submitCards", { cards: selectedCards, myIndex });
    dispatch(deleteCards());
  }, [socket, selectedCards, myIndex]);

  return {
    data,
    waiting,
    showReady,
    showRefresh,
    onReady,
    skipTurn,
    canSubmit,
    submitCards,
  };
};

const checkFiveCards = (cards, useCard) => {
  const sorted = cards
    .map((m) => m.number)
    .sort((a, b) => {
      const typeDiff = a.type - b.type;
      const aNumber = a.number > 2 ? a.number : a.number + 100;
      const bNumber = b.number > 2 ? b.number : b.number + 100;
      const numDiff = aNumber - bNumber;

      if (numDiff) {
        return numDiff;
      } else {
        return typeDiff;
      }
    });
  const typeSet = new Set();
  const numberSet = new Set();
  for (const c of cards) {
    typeSet.add(c.type);
  }
  for (const c of cards) {
    numberSet.add(c.number);
  }
  const isStraight = checkStraight(sorted, useCard);
  const isFlush = typeSet.size === 1;
  const isFullHouse =
    numberSet.size === 2 && (sorted[1] !== sorted[2] || sorted[2] != sorted[3]);
  const isFourCard = numberSet.size === 2 && !isFullHouse;

  let top;
  let type;
  if (isStraight || isFlush) {
    top = sorted[sorted.length - 1];
    if (isFlush) {
      type = cards[0].type;
    } else {
      for (let card of cards) {
        if (card.number === top) {
          type = card.type;
          break;
        }
      }
    }
  } else if (isFullHouse || isFourCard) {
    top = sorted[2];
  }

  if (top !== undefined && top < 3) {
    top += 100;
  }
  return {
    isStraight,
    isFlush,
    isFullHouse,
    isFourCard,
    top,
    type,
  };
};

const checkStraight = (numbers, useCard) => {
  const ns = Object.assign([], numbers);
  //ns.sort();
  let isStraight = true;
  let n = ns[0];
  for (let i = 1; i < ns.length; ++i) {
    if (i === ns.length-1 && ns[i]===1 && ns[i-1] === useCard) {
      
    } else if (ns[i] !== n + 1) {
      isStraight = false;
      break;
    }
    n = ns[i];
  }

  if (ns[ns.length - 1] === 2) {
    isStraight = false;
  }
  return isStraight;
};
