import React, { Component } from 'react';
import { Container } from '@material-ui/core';
import { Redirect } from 'react-router-dom';
import EmployeeInfo from './EmployeeInfo';


export class Main extends Component {
  static displayName = Main.name;

  constructor(props){
    super(props);

    this.config = JSON.parse(localStorage.getItem("config"));

    this.state = {
      redirect: {
        needed: false,
        to: "/login"
      },
      employeeInfo: {},
      roles: []
    }

    this.checkLocalStorage = this.checkLocalStorage.bind(this);
    this.loadRoles = this.loadRoles.bind(this);
  }

  componentDidMount() {
    let authorized = this.checkLocalStorage();
    if (!authorized.userId){
      this.setState({redirect: {
        needed: true,
        to: "/login"
      }});
      return;
    }
    let url = this.config.serverUrl + "/employee/" + authorized.userId;

    let options = {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      },
      mode: 'cors'
    };
    
    fetch(url, options).then(response => response.json(), rejected => {
        if (rejected.status == 401){
            let error = {
                title: "Ошибка входа", 
                description: "Неверный email или пароль. Возможно, вы не зарегистрированы"
            };
            this.setState({errors: [error]});
        }
    })
    .then(data => {
      this.setState({employeeInfo: data.result});
      this.loadRoles();
    })
    .catch(e => {
        console.error(e);
    });
  }

  loadRoles(){
    let url = this.config.serverUrl + "/employee/roles";

    let options = {
      method: "GET",
      headers: {
          "Content-Type": "application/json"
      },
      mode: 'cors'
    };
    let result = {};
    
    fetch(url,options).then(response => response.json(), rejected => {
        if (rejected.status == 401){
            let error = {
                title: "Ошибка входа", 
                description: "Неверный email или пароль. Возможно, вы не зарегистрированы"
            };
            this.setState({errors: [error]});
        }
    })
    .then(data => this.setState({roles: data.result}))
    .catch(e => {
        console.error(e);
    });
    return result;
  }

  checkLocalStorage(){
    let userId = localStorage.getItem("userId");
    return {userId};
  }

  render () {
    if (this.state.redirect.needed)
      return <Redirect to={this.state.redirect.to} from="/"/>

    return (
      <div>
        <Container id='main'>
            <EmployeeInfo info={this.state.employeeInfo} serverUrl={this.config.serverUrl} roles={this.state.roles}/>
        </Container>
      </div>
    );
  }
}