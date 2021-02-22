export const SYNC_GAME = "lexio/SYNC_GAME";
export const SELECT_CARD = "lexio/SELECT_CARD";
export const DELETE_CARDS = "lexio/DELETE_CARDS";
export const CLEAR_GAME = "lexio/CLEAR_GAME";

export const syncGame = (data) => ({
  type: SYNC_GAME,
  payload: data,
});

export const selectCard = (index) => ({
  type: SELECT_CARD,
  payload: index,
});

export const deleteCards = (indices) => ({
  type: DELETE_CARDS,
  payload: indices,
});

export const clearGame = (data) => ({
  type: CLEAR_GAME,
});
