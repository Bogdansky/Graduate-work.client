import React, { Component } from 'react';
import { Container, Button, Typography } from '@material-ui/core';
import { Redirect, Link } from 'react-router-dom';
import EmployeeInfo from './EmployeeInfo';


export class Main extends Component {
  static displayName = Main.name;

  constructor(props){
    super(props);

    this.state = {
      redirect: {
        needed: false,
        to: "/login"
      },
      employeeInfo: {}
    }

    this.showProjects = this.showProjects.bind(this);
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

  render () {
    if (this.state.redirect.needed)
      return <Redirect to={this.state.redirect.to} from="/"/>

    return (
      <div>
        <Container id='main'>
            <Typography>
              <EmployeeInfo key="employeeInfo" info={this.state.employeeInfo} serverUrl={this.props.serverUrl} roles={this.props.roles} updateInfo={this.updateEmployeeInfo}/>
              <Button variant="outlined" color="primary" onClick={this.showProjects}>Показать мои проекты</Button>
            </Typography>
        </Container>
      </div>
    );
  }
}