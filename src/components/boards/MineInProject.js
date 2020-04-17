import React from 'react'
import Grid from '@material-ui/core/Grid';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Task from '../Task'
import { Paper, Divider, Avatar } from '@material-ui/core';

export default class MineInProject extends React.Component {
    static displayName = MineInProject.name;

    constructor(props){
        super(props);

        this.state = {
            priorities: Array.from(new Set(this.props.tasks.map(t => t.priority)))
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({priorities: Array.from(new Set(nextProps.tasks.map(t => t.priority)))})
    }

    render(){
        if (!this.props.hidden && this.props.tasks.length == 0)
            return <h2>В проекте для вас заданий нет</h2>
        
        return (
            <div style={{display: this.props.hidden ? "none" : "inherit"}}>
                
            <Grid container spacing={3}>
                {this.state.priorities.map(p => {
                    return <Grid container direction="row" alignContent="center" item spacing={3}>
                    <Grid alignContent="center" item>
                        <Avatar>{p}</Avatar>
                    </Grid>
                    {this.props.tasks.filter(t => t.priority == p).map(t => {
                        return <Grid item>
                            <Task key={"task-" + t.id} roles={this.props.roles} teams={this.props.teams} update={this.props.updateTask} tracked={this.props.tracked} track={this.props.track} taskTypes={this.props.taskTypes} taskStatuses={this.props.taskStatuses} {...t}></Task>
                        </Grid>
                    })}
                    </Grid>
                })}
                </Grid>
            </div>
        );
    }
}