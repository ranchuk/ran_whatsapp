import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ChatsList from "./components/ChatsList";
import Login from "./components/Login";
import Register from "./components/Register";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import "./App.css";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { PersistGate } from "redux-persist/integration/react";
import io from "socket.io-client";

const persistConfig = {
  key: "root",
  storage
};
const persistedReducer = persistReducer(persistConfig, appReducer);

const middleware = [thunk];
var initialState = {
  username: "",
  chats: [],
  chatInView: {}
};
window.socket = io.connect("/");

if (window.socket !== undefined) {
  if (localStorage.getItem("persist:root")) {
    const data = JSON.parse(localStorage.getItem("persist:root"));
    window.socket.emit("join", data.username.replace(/['"]+/g, ""));
  }
} else {
  window.location.href = "/";
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

function appReducer(state = initialState, action) {
  switch (action.type) {
    case "Login": {
      return {
        ...state,
        username: action.payload.username,
        chats: action.payload.chats
      };
    }
    case "AddMessage": {
      const { reciever, sender } = action.payload;
      // console.log({ reciever, sender });
      const newChats = JSON.parse(JSON.stringify(state.chats));
      let obj = {};
      state.chats.forEach((chat, index) => {
        if (
          (chat.username1 === sender && chat.username2 === reciever) ||
          (chat.username1 === reciever && chat.username2 === sender)
        ) {
          newChats[index].chat.push(action.payload);
          obj = { chats: newChats };
          if (Object.keys(state.chatInView).length > 0) {
            //maby we didnt pick chat yet
            if (
              (state.chatInView.username1 === reciever &&
                state.chatInView.username2 === sender) ||
              (state.chatInView.username2 === reciever &&
                state.chatInView.username1 === sender)
            ) {
              const newChatInView = JSON.parse(JSON.stringify(newChats[index]));
              obj = {
                ...state,
                chats: newChats,
                chatInView: {
                  ...state.chatInView,
                  chat: [...newChatInView.chat]
                }
              };
              // console.log(obj);
            }
          }
          return;
        }
      });
      return { ...state, ...obj };
    }
    case "ChatInView": {
      return { ...state, chatInView: action.payload };
    }
    case "DeleteChatTemporary": {
      const { reciever } = action.payload;
      const newChats = JSON.parse(JSON.stringify(state.chats));
      state.chats.forEach((chat, index) => {
        if (chat.username1 === reciever || chat.username2 === reciever) {
          newChats[index].chat = [];
          return;
        }
      });
      return { ...state, chats: newChats };
    }
    case "someoneWriting": {
      if (Object.keys(state.chatInView).length > 0) {
        //maby we didnt pick chat yet
        const { sender, length } = action.payload;
        const newChatInView = JSON.parse(JSON.stringify(state.chatInView));

        if (
          (state.chatInView.username1 === sender ||
            state.chatInView.username2 === sender) &&
          length > 0
        ) {
          newChatInView.isWriting = true;
        } else {
          newChatInView.isWriting = false;
        }

        return { ...state, chatInView: newChatInView };
      } else return state;
    }
    default: {
      return state;
    }
  }
}

export const Context = React.createContext();

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <div className="App">
            <Route exact path="/" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/chats" component={ChatsList} />
          </div>
        </Router>
      </PersistGate>
    </Provider>
  );
};

export default App;
