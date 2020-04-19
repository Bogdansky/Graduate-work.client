import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import { Redirect } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Error from '../components/common/Error'

import axios from 'axios'

export class SignUp extends React.Component {
    static displayName = SignUp.name;

    constructor(props){
        super(props);
        
        this.state = {
            email: "",
            password: "",
            tryPassword: "",
            success: false
        };
        
        this.config = JSON.parse(localStorage.getItem("config"));

        this.onChange = this.onChange.bind(this);
        this.onSignUp = this.onSignUp.bind(this);
        this.validate = this.validate.bind(this);
    }

    validate(){
      let errors = [];

      if (!this.state.email || this.state.email === ""){
        errors.push({description: "Поле \"Электронная почта\" не может быть пустым!"})
      }
      if (!this.state.password || this.state.password === ""){
        errors.push({description: "Пароль не может быть пустым!"});
      }
      if (this.state.password != this.state.tryPassword){
        errors.push({description: "Пароли не совпадают!"});
      }
      this.setState({errors});
      return !errors.length;
    }

    onChange(e){
        switch(e.target.name){
            case "email": this.setState({email: e.target.value}); break;
            case "password": this.setState({password: e.target.value}); break;
            case "tryPassword": this.setState({tryPassword: e.target.value}); break;
            default: break;
        }
    }

    onSignUp(){
        let url = this.config.serverUrl + "/account/";

        if(!this.validate()) return;

        this.setState({errors: []}, function(){
          
          let body = JSON.stringify({
              "Login": this.state.email,
              "Password": this.state.password
          });
          let options = {
              method: "POST",
              headers: {
                  "Content-Type": "application/json"
              },
              mode: 'cors',
              body
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
              console.log(data);
              if (data.token){
                  localStorage.setItem("userId", data.userId);
                  localStorage.setItem("login", data.login);
                  localStorage.setItem("token", data.token);

                  this.setState({success: true, errors: []});
              } else {
                  this.setState({errors: [data.error]});
              }
          })
          .catch(e => {
              console.error(e);
          });
        });
    }

  render(){
    if (this.state.success)
      return <Redirect to="/" from="/signup"/>
      
    return (
        <Container component="main" maxWidth="xs" style={{marginTop: 20}}>
          <CssBaseline />
          <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}>
            <Avatar>
              <LockOutlinedIcon style={{marginRight: 0}}/>
            </Avatar>
            <Typography component="h1" variant="h5">
              Регистрация
            </Typography>
            <Error data={this.state.errors} />
            <div style={{ width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    color="white"
                    id="email"
                    label="Электронная почта"
                    name="email"
                    onChange={this.onChange}
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="password"
                    label="Пароль"
                    type="password"
                    id="password"
                    onChange={this.onChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    required
                    fullWidth
                    name="tryPassword"
                    label="Повторите пароль"
                    type="password"
                    id="tryPassword"
                    onChange={this.onChange}
                  />
                </Grid>
              </Grid>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={this.onSignUp}
              >
                Зарегистрироваться
              </Button>
              <Grid container justify="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2">
                    Уже есть аккаунт? Зайти
                  </Link>
                </Grid>
              </Grid>
            </div>
          </div>
        </Container>
      );
  }
}