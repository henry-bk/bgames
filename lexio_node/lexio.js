const initCards = (attendants) => {
  let useCard = 9;
  if (attendants === 4) {
    useCard = 13;
  } else if (attendants === 5) {
    useCard = 15;
  }

  const l = [];
  for (let i = 0; i < useCard; ++i) {
    l.push(i);
  }
  const cards = [];
  for (let i = 0; i < 4; ++i) {
    l.forEach((j) => {
      cards.push({ type: i, number: j + 1 });
    });
  }
  const at = [];
  for (let i = 0; i < attendants; ++i) {
    at.push({
      life: 50,
    });
  }

  return {
    cards,
    useCard,
    attendants: at,
  };
};

const shuffle = ({ cards, useCard, attendants }) => {
  let shuffledCards = Object.assign([], cards);
  shuffledCards.sort(() => Math.random() - Math.random());

  const newAttendants = [];
  const handCount = (useCard * 4) / attendants.length;
  for (let i = 0; i < attendants.length; ++i) {
    const cards_ = shuffledCards.slice(i * handCount, (i + 1) * handCount);
    cards_.sort((a, b) => {
      const typeDiff = a.type - b.type;
      const aNumber = a.number > 2 ? a.number : a.number + useCard;
      const bNumber = b.number > 2 ? b.number : b.number + useCard;
      const numDiff = aNumber - bNumber;

      if (numDiff) {
        return numDiff;
      } else {
        return -typeDiff;
      }
    });
    newAttendants.push({
      ...attendants[i],
      cards: cards_,
    });
  }

  let first = -1;
  for (let i = 0; i < shuffledCards.length; ++i) {
    const card = shuffledCards[i];
    if (card.type === 3 && card.number === 3) {
      first = Math.floor(i / handCount);
      break;
    }
  }

  return {
    first,
    attendants: newAttendants,
  };
};
module.exports = {
  initCards,
  shuffle,
};
