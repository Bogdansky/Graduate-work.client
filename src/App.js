import React from 'react';
import { Route, Router, Switch } from 'react-router-dom';
import { Main } from './components/Main'
import { About } from './components/Info/About'
import { NotFound } from './components/Info/NotFound'
import { Login } from './components/Login'
import { SignUp } from './components/SignUp'
import { Projects } from './components/Projects'
import Board from './components/Board'
import Statistics from './components/Statistics'
import { Button, Drawer, Link, Typography, IconButton, AppBar, Toolbar, MenuItem } from '@material-ui/core'
import DoubleArrowOutlinedIcon from '@material-ui/icons/DoubleArrowOutlined';
import MenuIcon from '@material-ui/icons/Menu';
import ComputerIcon from '@material-ui/icons/Computer'
import InputIcon from '@material-ui/icons/Input';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import AppsIcon from '@material-ui/icons/Apps';
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom';
import './App.css';
import { createBrowserHistory } from "history";
import config from './config.json'

const history = createBrowserHistory();

class App extends React.Component {
  constructor(props){
    super(props);

    this.state = {
      menuShow: false,
      roles: [],
      taskTypes: [],
      taskStatuses: [],
      expanded: false,
      logged: !!localStorage.getItem("userId")
    }

    localStorage.setItem("config", JSON.stringify(config));

    this.logOut = this.logOut.bind(this);
    this.changeShow = this.changeShow.bind(this);
    this.getAuthorizationError = this.getAuthorizationError.bind(this);
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }

  toggleExpanded(){
    let {expanded} = this.state;
    this.setState({expanded: !expanded}) 
  }

  componentWillMount(){
    let {roles, taskTypes, taskStatuses} = this.state;

    if (roles.length && taskTypes.length && taskStatuses.length)
      return;

    let url = config.serverUrl + "/employee/enums";

    let options = {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      },
      mode: 'cors'
    };
    
    fetch(url,options).then(response => response.json(), rejected => {
        if (rejected.status == 401){
            let error = {
                title: "Ошибка входа", 
                description: "Неверный email или пароль. Возможно, вы не зарегистрированы"
            };
            this.setState({errors: [error]});
        }
    })
    .then(data => this.setState({
      roles: data.result.roles, 
      taskTypes: data.result.taskTypes, 
      taskStatuses: data.result.taskStatuses
    }))
    .catch(e => {
        console.error(e);
    });
  }

  changeShow(){
    let show = this.state.menuShow;
    this.setState({menuShow: !show});
  }

  checkLocalStorage(){
    let userId = localStorage.getItem("userId");
    return !!userId;
  }

  getAuthorizationError(){
    return <Login errors={[{text: "Вы не авторизованы"}]} />;
  }

  logOut(){
    localStorage.removeItem("userId");
    localStorage.removeItem("employeeId");
    localStorage.removeItem("employeeInfo");
    localStorage.removeItem("token");
    localStorage.removeItem("login");
    this.setState({logged: false, menuShow: false});
  }

  render(){
    return (
      <div className="App">
        <Router history={history}>
          <AppBar position="static">
            <Toolbar>
              <IconButton edge="start" color="inherit" aria-label="menu" onClick={this.changeShow}>
                <MenuIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Drawer open={this.state.menuShow} onClose={this.changeShow}>
            <MenuItem><DoubleArrowOutlinedIcon color="primary" className={this.state.expanded ? "expand-arrows rotate-right" : "expand-arrows"} onClick={this.toggleExpanded}/></MenuItem>
            {!this.state.logged ?
              <React.Fragment>
                <MenuItem><Link className="App-link" onClick={this.changeShow} href="/signup"><PersonAddIcon/>{this.state.expanded ? "Зарегистрироваться" : ""}</Link></MenuItem>
                <MenuItem><Link className="App-link" onClick={this.changeShow} href="/login"><InputIcon/>{this.state.expanded ? "Войти" : ""}</Link></MenuItem>
              </React.Fragment> 
              : 
              <React.Fragment>
                <MenuItem>
                  <Link className="App-link" onClick={this.changeShow} href="/"><ComputerIcon/>{this.state.expanded ? "Главная" : ""}</Link>
                </MenuItem>
                <MenuItem>
                  <Link className="App-link" onClick={this.changeShow} href="/board/0"><AppsIcon/>{this.state.expanded ? "Проекты" : ""}</Link>
                </MenuItem><MenuItem><Link className="App-link" onClick={this.logOut}><MeetingRoomIcon color="primary"/>{this.state.expanded ? "Выйти" : ""}</Link></MenuItem>
              </React.Fragment>
            }
          </Drawer>
          <Switch>
            <Route exact path="/" render={props => this.checkLocalStorage() ? <Main serverUrl={config.serverUrl} roles={this.state.roles}/> : this.getAuthorizationError()} />
            <Route path="/projects" render={props => this.checkLocalStorage() ? <Projects serverUrl={config.serverUrl} roles={this.state.roles} /> : this.getAuthorizationError()} />
            <Route path="/board/:id" render={props => this.checkLocalStorage() ? <Board match={props.match} serverUrl={config.serverUrl} roles={this.state.roles} taskTypes={this.state.taskTypes} taskStatuses={this.state.taskStatuses} /> : this.getAuthorizationError()}/>
            <Route path="/statistics" render={props => this.checkLocalStorage() ? <Statistics serverUrl={config.serverUrl} /> : this.getAuthorizationError()} />
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
