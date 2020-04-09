import React from 'react';
import Task from './Task'

export class Tasks extends React.Component {
    static displayName = Tasks.name;

    constructor(props){
        super(props);

        this.state = {
            tasks: this.props.tasks || [],
            projectId: this.props.projectId || 0
        }

        this.config = JSON.parse(localStorage.getItem("config"));
    }

    componentDidMount() {
        let employeeId = localStorage.getItem("employeeId");
        this.setState({employeeId});

        let url = this.config.serverUrl + "/project?employeeId=" + employeeId;

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
            this.setState({tasks: data.result});
        })
        .catch(e => {
            console.error(e);
        });
    }

    render() {
        if (!this.state.tasks.length){
            return <h2>Нет заданий</h2>
        }

        return this.state.tasks.map(t => <Task task={t} />)
    }
}