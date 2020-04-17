import React from 'react';
import Project from './Project'
import CreateProject from './CreateProject'
import { Toolbar, AppBar, Grid, Paper } from '@material-ui/core';

export class Projects extends React.Component {
    static displayName = Projects.name;

    constructor(props){
        super(props);

        this.state = {
            projects: [],
            employeeId: this.props.employeeId || 0,
            employee: null
        }

        this.serverUrl = this.props.serverUrl || JSON.parse(localStorage.getItem("config")).serverUrl;
        this.addProject = this.addProject.bind(this);
    }

    componentDidMount() {
        let employeeId = localStorage.getItem("employeeId");
        let employee = JSON.parse(localStorage.getItem("employeeInfo"));
        this.setState({employeeId,employee});

        let url = this.serverUrl + "/project?employeeId=" + employeeId;

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
            this.setState({projects: data.result});
        })
        .catch(e => {
            console.error(e);
        });
    }

    addProject(value){
        let projects = this.state.projects;
        projects.push(value);
        this.setState({projects});
    }

    render() {
        if (!this.state.projects.length){
            return <h2>Вы не состоите ни в одном проекте!</h2>
        }
        return (
            <React.Fragment>
                {this.state.employee.roleId === 11 ? <AppBar color="transparent" position="relative">
                    <Toolbar>
                        <Grid container direction="row" spacing={3} style={{width: '100%'}} spacing={3}>
                            <Grid item xs={2}>
                                <CreateProject 
                                    addProject={this.addProject}
                                    serverUrl={this.props.serverUrl} 
                                />
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar> : ""}
                <Paper elevation={20}>
                    <Grid container>
                        <Grid container direction="row" item>
                            {this.state.projects.map(p => <Project roles={this.props.roles} serverUrl={this.serverUrl} {...p} />)}
                        </Grid>
                    </Grid>
                </Paper>
            </React.Fragment>
        );
    }
}