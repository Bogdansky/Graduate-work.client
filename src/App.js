import React from 'react';
import { Route, Redirect, Router, Switch } from 'react-router-dom';
import logo from './logo.svg';
import { Main } from './components/Main'
import { About } from './components/Info/About'
import { NotFound } from './components/Info/NotFound'
import { Login } from './components/Login'
import { SignUp } from './components/SignUp'
import { Button, Drawer, Link, Typography, IconButton, AppBar, Toolbar } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu';
import './App.css';
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      menuShow: false
    }

    this.changeShow = this.changeShow.bind(this);
  }

  changeShow(){
    let show = this.state.menuShow;
    this.setState({menuShow: !show});
  }

  render(){
    return (
      <div className="App">
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.changeShow}>
                <MenuIcon />
              </IconButton>
              <Typography variant="h6">
                News
              </Typography>
              <Link color="inherit">Login</Link>
            </Toolbar>
          </AppBar>
          <Drawer anchor="left" open={this.state.menuShow} onClose={this.changeShow}>
            <Router history={history}>
              <Link variant="button" onClick={this.changeShow} to="/">Главная</Link>
              <Link variant="button" onClick={this.changeShow} to="/about">О программе</Link>
            </Router>
          </Drawer>
          <Router history={history}>
            <Switch>
              <Route exact path="/" component={Main} />
              <Route path="/projects" />
              <Route path="/board" />
              <Route path="/statistics" />
              <Route path="/about" component={About} />
              <Route path="/login" component={Login} />
              <Route path="/signup" component={SignUp} />
              <Route component={NotFound} />
            </Switch>
          </Router>
      </div>
    );
  }
}

export default App;
