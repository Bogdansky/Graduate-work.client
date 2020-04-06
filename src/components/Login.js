import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

export class Login extends React.Component {
    static displayName = Login.name;

    constructor(props){
        super(props);

        this.state = {
            email: "",
            password: "",
            success: false,
            errors: []
        };
        this.config = JSON.parse(localStorage.getItem("config"));

        this.onLogin = this.onLogin.bind(this);
        this.onChange = this.onChange.bind(this);
    }

    onChange(e){
        switch(e.target.name){
            case "email": this.setState({email: e.target.value}); break;
            case "password": this.setState({password: e.target.value});break;
            default: break;
        }
    }

    onLogin(){
        let url = this.config.serverUrl + "/account/login";
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

                this.setState({
                    success: true,
                    errors: []
                });
            } else {
                this.setState({errors: [data.error]});
            }
        })
        .catch(e => {
            console.error(e);
        });
    }

    render(){
        return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}>
                <Avatar>
                <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                Вход
                </Typography>
                <div style={{
                    width: '100%'
                }} noValidate>
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Электронная почта"
                    name="email"
                    onChange={this.onChange}
                    autoComplete="email"
                    autoFocus
                />
                <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Пароль"
                    type="password"
                    id="password"
                    onChange={this.onChange}
                    autoComplete="current-password"
                />
                
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={this.onLogin}
                >
                    Войти
                </Button>
                <Grid container>
                    <Grid item xs>
                    </Grid>
                    <Grid item>
                    <Link href="/signup" variant="body1">
                        {"Нет аккаунта? Зарегистрируйте"}
                    </Link>
                    </Grid>
                </Grid>
                </div>
            </div>
        </Container>
        );
    }
}