import HomePage from "./components/home/HomePage";
import Login from "./components/login/Login";
import Signup from "./components/Signup/Signup";
import Dashboard from"./components/Dashboard/Dashboard";
import {BrowserRouter, Switch, Route, Link} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path= "/" component = {HomePage} />
          <Route exact path= "/login" component = {Login} />
          <Route exact path= "/signup" component = {Signup} />
          <Route exact path= "/dashboard" component = {Dashboard} />
        </Switch>
     </div>
    </BrowserRouter>
  );
}

export default App;
