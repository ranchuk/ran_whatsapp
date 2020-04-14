import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/home/home";
import Login from "./components/Login";
import Register from "./components/Register";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import "./App.css";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import { PersistGate } from "redux-persist/integration/react";
import io from "socket.io-client";
import appReducer from "./reducer";
import PrivateRoute from './common/privateRoute';
import NavBar from './common/navBar/navBar';

const persistConfig = {
  key: "root",
  storage
};
var initialState = {
  username: "",
  chats: [],
  chatInView: {}
};

const persistedReducer = persistReducer(persistConfig, appReducer);

const middleware = [thunk];

window.socket = io.connect("/");

if (window.socket !== undefined) {
  if (sessionStorage.getItem("persist:root")) {
    const data = JSON.parse(sessionStorage.getItem("persist:root"));
    window.socket.emit("join", data.username.replace(/['"]+/g, ""));
  }
} else {
  window.location.href = "/login";
}

const store = createStore(
  persistedReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);
let persistor = persistStore(store);

export const Context = React.createContext();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className="MainLayout">
            <NavBar />
            <div className="MainContainer">
            <PrivateRoute exact path="/" component={Home} auth={{isAuthenticated: true}}/>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            </div>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
