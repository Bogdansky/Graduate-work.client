import React, { Component } from 'react';
import { Container } from 'reactstrap';

export class Main extends Component {
  static displayName = Main.name;

  constructor(props){
    super(props);

    this.state = {
      redirect: {
        needed: true,
        to: "/login"
      }
    }

    this.checkLocalStorage = this.checkLocalStorage.bind(this);
  }

  checkLocalStorage(){
    let userId = localStorage.getItem("userId");
  }

  render () {
    return (
      <div>
        <Container id='main'>
           {this.props.children}
        </Container>
      </div>
    );
  }
}