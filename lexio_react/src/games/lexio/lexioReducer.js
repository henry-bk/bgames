import {
  SYNC_GAME,
  SELECT_CARD,
  DELETE_CARDS,
  CLEAR_GAME,
} from "./lexioActions";

export default (state = {}, action) => {
  const { type, payload } = action;

  let cards;
  console.log(state);
  switch (type) {
    case SYNC_GAME:
      return {
        ...state,
        ...payload,
        selectedCards: [],
      };
    case SELECT_CARD:
      cards = Object.assign([], state.cards);
      cards[payload].selected = !cards[payload].selected;

      const selectedCards = [];
      for (let i = 0; i < cards.length; ++i) {
        if (cards[i].selected) {
          selectedCards.push(i);
        }
      }
      return { ...state, cards, selectedCards };
    case DELETE_CARDS:
      const toDelete = state.selectedCards;
      const newCard = [];
      for (let i = 0; i < state.cards.length; ++i) {
        if (toDelete.indexOf(i) === -1) {
          newCard.push(state.cards[i]);
        }
      }
      return { ...state, cards: newCard, selectedCards: [] };
    case CLEAR_GAME:
      return {};
    default:
      return state;
  }
};
