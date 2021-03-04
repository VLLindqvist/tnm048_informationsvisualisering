import { FC } from "react";
import { createStore, applyMiddleware, combineReducers } from "redux";
import thunkMiddleware from "redux-thunk";
import { Provider } from "react-redux";

import country from "./country";

//COMBINING ALL REDUCERS
const combinedReducer = combineReducers({
  country,
  // OTHER REDUCERS WILL BE ADDED HERE
});

// BINDING MIDDLEWARE
const bindMiddleware = (middleware: any) => {
  if (process.env.NODE_ENV !== "production") {
    const { composeWithDevTools } = require("redux-devtools-extension");
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const useRedux = () => {
  const store = createStore(combinedReducer, bindMiddleware([thunkMiddleware])); // Creating the store

  return { store };
};

const StoreWithProvider: FC = ({ children }) => {
  const { store } = useRedux();

  return <Provider store={store}>{children}</Provider>;
};

export default StoreWithProvider;
