import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Home from "./components/home/home";
import Login from "./components/login/login";
import Register from "./components/register/register";
import { createStore, applyMiddleware, compose } from "redux";
import { Provider } from "react-redux";
import thunk from "redux-thunk";
import "./App.css";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage/session";
import { PersistGate } from "redux-persist/integration/react";
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
  chatInView: {},
  token: '',
  isNavbarOpen: false
};

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
