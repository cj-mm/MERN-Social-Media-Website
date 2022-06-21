import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import Feed from './pages/Feed';
import Profile from './pages/Profile';
import Search from './pages/Search';
import PrivateRoute from './PrivateRoute'; // accessible only if logged in
import PublicRoute from './PublicRoute'; // not accessible if logged in

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact={true} path="/" render={() => <Redirect to="/log-in" />} />
          <PublicRoute exact={true} path="/sign-up" component={SignUp} />
          <PublicRoute exact={true} path="/log-in" component={Login} />
          <PrivateRoute exact={true} path="/feed" component={Feed} />
          <PrivateRoute path="/profile" component={Profile} />
          <PrivateRoute exact={true} path="/search" component={Search} />
          <Route path="*" render={() => <h1>404 NOT FOUND</h1>} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
 