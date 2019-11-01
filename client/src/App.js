import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ChatsList from "./components/ChatsList";
import Login from "./components/Login";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import "./App.css";

const initialState = {
  username: "",
  chats: [],
  socket: "",
  chatInView: {}
};
const middleware = [thunk];

const store = createStore(
  appReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__ &&
          window.__REDUX_DEVTOOLS_EXTENSION__()
      : f => f
  )
);

function appReducer(state = initialState, action) {
  switch (action.type) {
    case "Login": {
      return {
        ...state,
        username: action.payload.username,
        chats: action.payload.chats,
        socket: action.payload.socket
      };
    }
    case "AddMessage": {
      const { reciever, sender } = action.payload;
      const newChats = JSON.parse(JSON.stringify(state.chats));
      let obj = {};
      state.chats.forEach((chat, index) => {
        if (
          (chat.username1 === sender && chat.username2 === reciever) ||
          (chat.username1 === reciever && chat.username2 === sender)
        ) {
          console.log({ sender, reciever });
          console.log({ chat });

          newChats[index].chat.push(action.payload);
          if (
            (state.chatInView.username1 === reciever &&
              state.chatInView.username2 === sender) ||
            (state.chatInView.username2 === reciever &&
              state.chatInView.username1 === sender)
          ) {
            const newChatInView = JSON.parse(JSON.stringify(newChats[index]));
            obj = { ...state, chats: newChats, chatInView: newChatInView };
          }
          return;
        }
      });
      return { ...state, ...obj };
    }
    case "ChatInView": {
      return { ...state, chatInView: action.payload };
    }
    case "someoneWriting": {
      const username = action.payload;
      const newChats = JSON.parse(JSON.stringify(state.chats));
      newChats.forEach(chat => {
        if (chat.username1 === username || chat.username2 === username) {
          chat.isWriting = true;
        }
      });
      return { ...state, chats: newChats };
    }
    case "someoneStoppedWriting": {
      const username = action.payload;
      const newChats = JSON.parse(JSON.stringify(state.chats));
      newChats.forEach(chat => {
        if (chat.username1 === username || chat.username2 === username) {
          chat.isWriting = false;
        }
      });
      return { ...state, chats: newChats };
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
      <Router>
        <div className="App">
          <Route exact path="/" component={Login} />
          <Route exact path="/chats" component={ChatsList} />
        </div>
      </Router>
    </Provider>
  );
};

export default App;
