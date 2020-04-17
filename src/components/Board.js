import React from 'react'
import { Toolbar, Typography, RadioGroup, Radio, FormControlLabel, Select, MenuItem, Grid, AppBar, Paper } from '@material-ui/core';
import {AllMine, AllInProject, MineInProject} from './Boards'
import CreateTask from './CreateTask'

export default class Board extends React.Component {
    static displayName = Board.name;

    constructor(props){
        super(props);
        let projectId = this.props.match ? this.props.match.params.id : 0;
        this.state = {
            filter: projectId != "0" ? "AllInProject" : "AllMine",
            tasks: [],
            projects: [],
            teams: [],
            errors: [],
            projectId: projectId,
            tracked: {
                taskId: null
            },
            employeeId: localStorage.getItem("employeeId")
        }

        this.onProjectChange = this.onProjectChange.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.loadData = this.loadData.bind(this);
        this.addTask = this.addTask.bind(this);
        this.updateTask = this.updateTask.bind(this);
        this.trackTask = this.trackTask.bind(this);
    }

    trackTask(taskId, cancel = false){
        if (taskId){
            this.setState({tracked: {taskId: cancel ? null : taskId}}, cancel ? alert("Untracking task " + taskId) : alert("Tracking task " + taskId));
        }
    }
    
    componentDidMount(){
        this.loadData();
    }

    loadData(){
        let employeeId = localStorage.getItem("employeeId");
        let url = this.props.serverUrl + `/task/${employeeId}/filter/0/project/0`;

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
            let projects = data.result.projects;
            let tasks = [].concat(...data.result.projects.map(p => p.tasks));
            this.setState({projects, tasks, teams: data.result.teams});
        })
        .catch(e => {
            console.error(e);
        });
    }

    setFilter(e){
        this.setState({filter: e.target.value});
    }

    onProjectChange(value){
        let v = value.target ? value.target.value : value;
        this.setState({projectId: v})
    }
    
    addTask(value){
        let arr = this.state.tasks;
        arr.push(value);
        this.setState({tasks: arr});
    }

    updateTask(value){
        let array = this.state.tasks;
        let index = array.findIndex(t => t.id === value.id);
        if (!~index){
            let error = {text: "Такого задания уже нет"};
            this.setState({errors: [error]});
            return;
        }
        array[index] = value;
        this.setState({tasks: array});
    }

    render(){
        return (
            <React.Fragment>
                <AppBar color="transparent" position="relative">
                <Toolbar>
                    <Grid container direction="row" spacing={3} style={{width: '100%'}} xs={12}>
                        <Grid item xs={2}>
                            <CreateTask teams={this.state.teams} 
                                roles={this.props.roles}
                                addTask={this.addTask}
                                serverUrl={this.props.serverUrl} 
                                taskTypes={this.props.taskTypes} 
                                projects={this.state.projects}
                            />
                        </Grid>
                        <Grid item xs={4}>
                            <RadioGroup row={true} value={this.state.filter} onClick={this.setFilter}>
                                <FormControlLabel value="AllMine" control={<Radio />} label="Мои" />
                                <FormControlLabel value="AllInProject" control={<Radio />} label="Все в проекте" />
                                <FormControlLabel value="MineInProject" control={<Radio />} label="Мои в проекте" />
                            </RadioGroup>
                        </Grid>
                        {!["AllInProject", "MineInProject"].includes(this.state.filter) ? "" : <Grid item xs={3}>
                            <Select style={{ width: 300 }} name="type"
                            onChange={this.onProjectChange}
                            value={this.state.projectId}
                            >
                                {this.state.projects.map(r => {
                                    return <MenuItem value={r.id}>{r.name}</MenuItem>
                                })}
                            </Select>
                        </Grid>}
                    </Grid>
                </Toolbar>
                </AppBar>
                <Paper>
                <AllMine teams={this.state.teams} 
                         roles={this.props.roles}
                         updateTask={this.updateTask} 
                         tracked={this.state.tracked}
                         track={this.trackTask} 
                         projects={this.state.projects} 
                         taskTypes={this.props.taskTypes} 
                         taskStatuses={this.props.taskStatuses} 
                         tasks={this.state.tasks.filter(t => t.employeeId == this.state.employeeId)}
                         hidden={this.state.filter !== "AllMine"} /> 
                <AllInProject teams={this.state.teams} 
                         roles={this.props.roles}
                                    updateTask={this.updateTask} 
                                    tracked={this.state.tracked} 
                                    track={this.trackTask} 
                                    taskTypes={this.props.taskTypes} 
                                    taskStatuses={this.props.taskStatuses}     
                                    tasks={this.state.tasks.filter(t => t.projectId == this.state.projectId)}
                                    hidden={this.state.filter !== "AllInProject"} />
                <MineInProject teams={this.state.teams} 
                         roles={this.props.roles}
                                updateTask={this.updateTask} 
                                tracked={this.state.tracked} 
                                track={this.trackTask} 
                                taskTypes={this.props.taskTypes} 
                                taskStatuses={this.props.taskStatuses} 
                                tasks={this.state.tasks.filter(t => t.projectId == this.state.projectId && t.employeeId == this.state.employeeId)}
                                hidden={this.state.filter !== "MineInProject"} />
                {!["AllMine", "AllInProject", "MineInProject"].includes(this.state.filter) ? <h2>Фильтр не выбран</h2> : ""}           
                </Paper>
            </React.Fragment>
        );
    };
}