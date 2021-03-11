const app = require("express")();
const { initCards, shuffle } = require("./lexio");
const cors = require("cors");

app.use(cors());

const http = require("http").createServer(app).listen(8000, "0.0.0.0");
const io = require("socket.io")(http, {
  cors: {
    origin: "*",
  },
});

let readyCount = 0;
let started;

io.on("connection", (socket) => {
  console.log(socket.id, "connected.");
  socket.join("lexio");

  const members = io.sockets.adapter.rooms.get("lexio");
  if (members.size >= 3 && !started) {
    io.sockets.in("lexio").emit("ask ready");
    readyCount = 0;
  }

  io.sockets.in("lexio").emit("new attendant", socket.id);

  socket.on("disconnect", () => {
    console.log("bye", socket.id);
  });

  socket.on("ready", () => {
    readyCount += 1;

    if (readyCount === members.size) {
      console.log("Let's get started.");
      started = true;
      const initData = initCards(readyCount);
      const { attendants, first } = shuffle(initData);
      const ids = [];
      members.forEach((id) => {
        ids.push(id);
      });
      started = {
        ...initData,
        turn: first,
        attendants, // this attendants should be after initData
        ids,
        floor: [],
      };
      sync();
    }
  });

  socket.on("skip", () => {
    const next = (started.turn + 1) % started.ids.length;
    if (next === started.lastSubmit) {
      started.floor = [];
    }
    proceedTurn();
  });

  socket.on("submitCards", ({ myIndex, cards }) => {
    const myCards = started.attendants[myIndex].cards;
    const newCard = [];
    for (let i = 0; i < myCards.length; ++i) {
      const card = myCards[i];
      let found = false;
      for (const submitCard of cards) {
        if (
          submitCard.type === card.type &&
          submitCard.number === card.number
        ) {
          found = true;
          break;
        }
      }
      if (!found) {
        newCard.push(card);
      }
    }
    started.attendants[myIndex].cards = newCard;

    started.floor.push(cards);
    started.lastSubmit = myIndex;

    if (newCard.length > 0) {
      proceedTurn();
    } else {
      io.sockets.in("lexio").emit("round finished");
      exchangeLife();
      const { attendants, first } = shuffle(started);
      started = {
        ...started,
        attendants,
        turn: first,
        floor: [],
      };

      if (!checkGameOver()) {
        // client ui waiting and reset.
        setTimeout(() => {
          sync();
        }, 5000);
      } else {
        io.sockets.in("lexio").emit("game finished");
        readyCount = 0;
        started = undefined;
      }
    }
  });
});

const checkGameOver = () => {
  for (let i = 0; i < started.ids.length; ++i) {
    const life = started.attendants[i].life;
    console.log(life);
    if (life <= 0) {
      return true;
    }
  }
  return false;
};

const exchangeLife = () => {
  for (let i = 0; i < started.ids.length; ++i) {
    for (let j = i + 1; j < started.ids.length; ++j) {
      const iCards = started.attendants[i].cards;
      const jCards = started.attendants[j].cards;

      const i2 = iCards.filter((card) => card.number === 2);
      const j2 = jCards.filter((card) => card.number === 2);

      let penalty = 1;
      let diff = Math.abs(iCards.length - jCards.length);
      if (iCards.length < jCards.length) {
        if (j2.length) {
          penalty = j2.length * 2;
        }
        diff *= penalty;
        started.attendants[i].life += diff;
        started.attendants[j].life -= diff;
      } else if (iCards.length > jCards.length) {
        if (i2.length) {
          penalty = i2.length * 2;
        }
        diff *= penalty;
        started.attendants[i].life -= diff;
        started.attendants[j].life += diff;
      }
    }
  }
};

const proceedTurn = () => {
  started = {
    ...started,
    turn: (started.turn + 1) % started.ids.length,
  };
  sync();
};

const sync = () => {
  const players = [];

  for (let i = 0; i < started.ids.length; ++i) {
    const id = started.ids[i];
    players.push({
      id,
      cardCount: started.attendants[i].cards.length,
      life: started.attendants[i].life,
    });
  }

  for (let i = 0; i < started.ids.length; ++i) {
    const id = started.ids[i];
    io.to(id).emit("sync", {
      useCard: started.useCard,
      myIndex: i,
      turn: started.turn,
      ...started.attendants[i],
      players,
      floor: started.floor,
    });
  }

};
