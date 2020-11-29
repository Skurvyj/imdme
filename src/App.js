import HomePage from "./components/home/HomePage";
import Login from "./components/login/Login";
import Signup from "./components/Signup/Signup";
import Dashboard from"./components/Dashboard/Dashboard";
import {BrowserRouter, Switch, Route} from "react-router-dom";

function App() {
  //react router for the page
  return (
    <BrowserRouter>
      <div>
        <Switch>
          <Route exact path= "/" component = {HomePage} />
          <Route path= "/login" component = {Login} />
          <Route path= "/signup" component = {Signup} />
          <Route path= "/dashboard" component = {Dashboard} />
        </Switch>
     </div>
    </BrowserRouter>
  );
}

export default App;
