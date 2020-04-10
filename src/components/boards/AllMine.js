import React from 'react'
import {Grid} from '@material-ui/core'
import Task from '../Task'

export default class AllMine extends React.Component {
    static displayName = AllMine.name;

    constructor(props){
        super(props);

        this.state = {
            columns: this.props.map(t => t.project.name),

        }

        this.getTasksByProject = this.getTasksByProject.bind(this);
    }

    getTasksByProject(projectName){
        return this.props.tasks.findAll(t => t.project.name == projectName);
    }

    render(){
        return (
            <Grid>

            </Grid>
        );
    }
}