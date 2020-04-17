import React from 'react'
import { Container, Paper, Typography } from '@material-ui/core';

export default class Statistics extends React.Component {
    static displayName = Statistics.name;

    constructor(props){
        super(props);
    }

    render(){
        return (
            <Paper>
                <Typography variant="h5" align="left">Всего задач: {this.props.total}</Typography>
                <Typography variant="h5" align="left">Общее время, затраченное на задачи: {this.props.totalTime}</Typography>
                <Typography variant="h5" align="left">Закрытых задач: {this.props.closed}</Typography>
                <Typography variant="h5" align="left">Общий рейтинг: {this.props.overallRate == 0 ? "Нет данных" : this.props.overallRate + "%" }</Typography>
            </Paper>
        );
    }
}