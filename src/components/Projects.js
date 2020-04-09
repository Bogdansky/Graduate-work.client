import React from 'react';
import Project from './Project'

export class Projects extends React.Component {
    static displayName = Projects.name;

    constructor(props){
        super(props);

        this.state = {
            projects: [],
            employeeId: this.props.employeeId || 0
        }

        this.serverUrl = this.props.serverUrl || JSON.parse(localStorage.getItem("config")).serverUrl;
    }

    componentDidMount() {
        let employeeId = localStorage.getItem("employeeId");
        this.setState({employeeId});

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

    render() {
        if (!this.state.projects.length){
            return <h2>Вы не состоите ни в одном проекте!</h2>
        }

        return this.state.projects.map(p => <Project serverUrl={this.serverUrl} {...p} />)
    }
}