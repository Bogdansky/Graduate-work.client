import React from 'react'
import { Toolbar, Typography, RadioGroup, Radio, FormControlLabel, Grid } from '@material-ui/core';
import {AllMine, AllInProject, MineInProject} from './Boards'
import CreateTask from './CreateTask'

export default class Board extends React.Component {
    static displayName = Board.name;

    constructor(props){
        super(props);

        this.state = {
            filter: "AllMine",
            tasks: [],
            projects: []
        }

        this.setFilter = this.setFilter.bind(this);
        this.loadProjects = this.loadProjects.bind(this);
    }

    loadProjects(){
        let employeeId = localStorage.getItem("employeeId");
        let url = this.props.serverUrl + `/employee/${employeeId}/projects`;

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
    
    componentDidMount(){
        let employeeId = localStorage.getItem("employeeId");
        let url = this.props.serverUrl + `/task/${employeeId}/filter?TaskFilterType=${this.state.filter}`;

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
            this.setState({tasks: data.result}, this.loadProjects());
        })
        .catch(e => {
            console.error(e);
        });
    }

    setFilter(e){
        this.setState({filter: e.target.value});
    }

    render(){
        return (
            <React.Fragment>
                <Toolbar>
                    <div>
                        <RadioGroup row={true} value={this.state.filter} onClick={this.setFilter}>
                            <FormControlLabel value="AllMine" control={<Radio />} label="Мои" />
                            <FormControlLabel value="AllInProject" control={<Radio />} label="Все в проекте" />
                            <FormControlLabel value="MineInProject" control={<Radio />} label="Мои в проекте" />
                        </RadioGroup>
                        <CreateTask serverUrl={this.props.serverUrl} taskTypes={this.props.taskTypes} projects={this.state.projects}/>
                    </div>
                </Toolbar>
            </React.Fragment>
        );
    };
}