import React from 'react'
import Grid from '@material-ui/core/Grid';
import { Divider, Paper, Avatar } from '@material-ui/core';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Task from '../Task'

export default class AllInProject extends React.Component {
    static displayName = AllInProject.name;

    constructor(props){
        super(props);

        this.state = {
            sortedTasks: this.props.tasks,
            priorities: Array.from(new Set(this.props.tasks.map(t => t.priority)))
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({priorities: Array.from(new Set(nextProps.tasks.map(t => t.priority)))})
    }

    render(){
        if (!this.props.hidden && this.props.tasks.length == 0)
            return <h2>В проекте нет заданий</h2>
        
        return (
            <React.Fragment>
                <div style={{display: this.props.hidden ? "none" : "inherit"}}>
                    
                    <Grid style={{width: "100%"}} container spacing={3}>
                        {this.state.priorities.map(p => {
                            return <React.Fragment>
                                <Grid item container alignContent="center" direction="row" spacing={3}>
                                    <Grid item>
                                        <Avatar>{p}</Avatar>
                                    </Grid>
                                    {this.props.tasks.filter(t => t.priority == p).map(t => {
                                        return <Grid item>
                                            <Task key={"task-"+t.id} roles={this.props.roles} teams={this.props.teams} update={this.props.updateTask} tracked={this.props.tracked} track={this.props.track} taskTypes={this.props.taskTypes} taskStatuses={this.props.taskStatuses} {...t}></Task>
                                        </Grid>
                                    })}
                                </Grid>
                            </React.Fragment>
                        })}
                        </Grid>
                </div>
            </React.Fragment>
        );
    }
}