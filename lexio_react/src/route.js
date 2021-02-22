import React from "react";
import { Provider } from "react-redux";
import { createStore, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { BrowserRouter, Route } from "react-router-dom";
import LexioContainer from "./games/lexio/LexioContainer";
import lexio from "./games/lexio/lexioReducer";

const Main = () => {
  const store = createStore(
    combineReducers({ lexio }),
    {},
    composeWithDevTools()
  );

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Route exact path="/" component={LexioContainer} />
      </BrowserRouter>
    </Provider>
  );
};

export default Main;
