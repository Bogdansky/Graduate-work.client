import React from 'react'
import {Grid, Divider, Paper} from '@material-ui/core'
import Task from '../Task'

export default class AllMine extends React.Component {
    static displayName = AllMine.name;

    constructor(props){
        super(props);

        this.state = {
            employeeId: localStorage.getItem("employeeId")
        }

        this.getTasksByProject = this.getTasksByProject.bind(this);
    }

    getTasksByProject(projectName){
        return this.props.tasks.filter(t => t.project.name == projectName);
    }

    render(){
        if (!this.props.hidden && this.props.tasks.length == 0)
            return <h2>У вас нет заданий</h2>

        return (
            <div style={{
                display: this.props.hidden ? "none" : "inherit"
            }}>
                <Grid container direction="row">
                    {this.props.projects.map(p => {
                        return <Grid item direction="column">
                            <h3>{p.name}</h3>
                            {this.props.tasks.filter(t => t.projectId === p.id).map(t => <Task key={"task-" + t.id} roles={this.props.roles} teams={this.props.teams} update={this.props.updateTask} tracked={this.props.tracked} track={this.props.track} taskTypes={this.props.taskTypes} taskStatuses={this.props.taskStatuses} key={"task-" + t.id} {...t}/>)}
                        </Grid>
                    })}
                        <Divider orientation="vertical"/>
                    </Grid>
            </div>
        );
    }
}