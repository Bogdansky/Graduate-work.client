import React, { Component } from 'react';
import { Container, Button, Typography, Grid, ButtonGroup } from '@material-ui/core';
import { Redirect, Link } from 'react-router-dom';
import EmployeeInfo from './EmployeeInfo';
import Statistics from './Statistics'


export class Main extends Component {
  static displayName = Main.name;

  constructor(props){
    super(props);

    this.state = {
      redirect: {
        needed: false,
        to: "/login"
      },
      employeeInfo: {},
      statistics: null
    }

    this.showProjects = this.showProjects.bind(this);
    this.loadStatistics = this.loadStatistics.bind(this);
    this.updateEmployeeInfo = this.updateEmployeeInfo.bind(this);
  }

  componentDidMount() {
    let userId = localStorage.getItem("userId");
    if (!userId){
      this.setState({redirect: {
        needed: true,
        to: "/login"
      }});
      return;
    }
    let url = this.props.serverUrl + "/employee/" + userId;

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
      localStorage.setItem("employeeId", data.result.id);
      localStorage.setItem("employeeInfo", JSON.stringify(data.result));
      this.setState({employeeInfo: data.result});
    })
    .catch(e => {
        console.error(e);
    });
  }

  updateEmployeeInfo(value){
    this.setState({employeeInfo: value});
  }

  showProjects(){
    this.setState({redirect: {
      needed: true,
      to: "/projects"
    }})
  }

  loadStatistics(){
    let employeeId = localStorage.getItem("employeeId");
    
    let url = this.props.serverUrl + "/employee/" + employeeId + "/stats";

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
      this.setState({statistics: data.result});
    })
    .catch(e => {
        console.error(e);
    });
  }

  render () {
    if (this.state.redirect.needed)
      return <Redirect to={this.state.redirect.to} from="/"/>

    return (
      <div>
        <Container id='main'>
            <ButtonGroup color="primary" aria-label="outlined primary button group">
              <Button onClick={this.loadStatistics}>Посмотреть мою статистику</Button>
              <EmployeeInfo key="employeeInfo" info={this.state.employeeInfo} serverUrl={this.props.serverUrl} roles={this.props.roles} updateInfo={this.updateEmployeeInfo}/>
              <Button onClick={this.showProjects}>Показать мои проекты</Button>
            </ButtonGroup>
            {this.state.statistics && <Statistics {...this.state.statistics}/>}
        </Container>
      </div>
    );
  }
}