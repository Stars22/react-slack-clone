import React, { Component } from "react";
import ReactDOM from "react-dom";
import "semantic-ui-css/semantic.min.css";
import App from "./components/App";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter, Switch, Route, withRouter } from "react-router-dom";
import firebase from "./firebase";
import { createStore } from "redux";
import { Provider, connect } from "react-redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./srore/reducers";
import {setUser} from "./srore/actions/index"
import Spinner from './components/Spinner/Spinner'

const store = createStore(rootReducer, composeWithDevTools());

class Root extends Component {
  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.props.setUser(user);
        this.props.history.push("/");
      }
    });

  }
  render() {
    return this.props.isLoading ?  <Spinner /> : (
        <Switch>
          <Route path="/" exact component={App} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
        </Switch>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.user.isLoading
})
const RootWithRouter = withRouter(connect(mapStateToProps, { setUser })(Root));

const app = (
  <Provider store={store}>
    <BrowserRouter>
      <RootWithRouter />
    </BrowserRouter>
  </Provider>
)


ReactDOM.render(app, document.getElementById("root"));
registerServiceWorker();
