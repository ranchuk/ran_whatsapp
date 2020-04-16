import React, { useEffect,useState } from "react";
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";
import Home from "./components/home/home";
import Login from "./components/Login";
import Register from "./components/Register";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider, useDispatch } from "react-redux";
import thunk from "redux-thunk";
import "./App.css";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import { PersistGate } from "redux-persist/integration/react";
import io from "socket.io-client";
import appReducer from "./reducer";
import PrivateRoute from './common/privateRoute';
import NavBar from './common/navBar/navBar';
import jwt from 'jsonwebtoken';
import axios from "axios";

const socketConnection = require('./utils').socketConnection;
const setAuthToken = require('./utils').setAuthToken;

const persistConfig = {
  key: "root",
  storage
};
var initialState = {
  username: "",
  chats: [],
  chatInView: {},
  token: '',
  isNavbarOpen: false
};
// if (sessionStorage.getItem("persist:root")) {
//   const data = JSON.parse(sessionStorage.getItem("persist:root"));
//   if(data.token){
//       setAuthToken(data.token.replace(/['"]+/g, ""));
//       axios.get("/api/users/getChats").then((res)=>{
//         socketConnection(data.username.replace(/['"]+/g, ""), data.token.replace(/['"]+/g, ""), store.dispatch, props.history, res.data.chats);
//       }).catch((e)=>{
//         console.log(e)
//         // window.location.href = "/login";
//       })
//   }
// }
const persistedReducer = persistReducer(persistConfig, appReducer);

const middleware = [thunk];

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
// const [isBurgerOpen, setIsBurgerOpen] = useState(false);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className="MainLayout">
            <NavBar />
             <div className="MainContainer">
              <Switch>
                <PrivateRoute exact path="/" component={Home} />
                <Route exact path="/register" component={Register} />
                <Route exact path="/login" component={Login} />
            </Switch>
            </div> 
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
