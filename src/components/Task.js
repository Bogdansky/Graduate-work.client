import React from 'react';
import { createMuiTheme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import BugReportIcon from '@material-ui/icons/BugReport';
import BuildIcon from '@material-ui/icons/Build';
//статусы
import NewReleasesIcon from '@material-ui/icons/NewReleases'; // Created 1
import DirectionsRunIcon from '@material-ui/icons/DirectionsRun'; // Active 2
import VisibilityIcon from '@material-ui/icons/Visibility'; // QA 3
import CancelIcon from '@material-ui/icons/Cancel'; // Closed 4

import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import moment from 'moment'

import Edit from './EditTask'

const styles = [
    {},
    {
        backgroundColor: "#FFEC00",
        color: "#000"
    },
    {
        backgroundColor: "#f00",
        color: "#000"
    }
]

export default class Task extends React.Component {
    static displayName = Task.name;

    constructor(props){
        super(props);

        this.state = {
            expanded: false,
            actionMenuOpen: false,
            editOpen: false,
            anchorAction: null,
            team: this.props.teams && this.props.teams.some(t => t.id == this.props.projectId) ? this.props.teams.find(t => t.id == this.props.projectId).team : []
        }

        this.track = this.track.bind(this);
        this.update = this.update.bind(this);   
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this); 
        this.getStatusIcon = this.getStatusIcon.bind(this);
        this.handleEditOpen = this.handleEditOpen.bind(this);
        this.handleEditClose = this.handleEditClose.bind(this);
        this.handleExpandClick = this.handleExpandClick.bind(this);
    }

    componentWillReceiveProps(nextProps){
        let team = this.state.team;
        if (nextProps.teams){
            team = nextProps.teams.find(t => t.id == this.props.projectId).team;
        }
        this.setState({team})
    }

    track(){
        const employeeId = localStorage.getItem("employeeId");
        this.props.track(this.props.id, employeeId);
    }

    update(value){
        this.setState({editOpen: false, actionMenuOpen: false}, this.props.update(value));
    }

    handleOpen(e) {
        this.setState({anchorAction: e.currentTarget, actionMenuOpen: true});
    }

    handleClose() {
        this.setState({actionMenuOpen: false});
    }
    
    handleEditOpen(){
        this.setState({editOpen: true})
    }

    handleEditClose(){
        this.setState({editOpen: false})
    }

    handleExpandClick(){
        let expanded = !this.state.expanded;
        this.setState({expanded});
    }

    getStatusIcon(){
        let descr = this.props.taskStatuses.find(t => t.id === this.props.taskStatus).name;
        return this.props.taskStatus === 1 ? <Tooltip title={descr}><NewReleasesIcon/></Tooltip>
        : this.props.taskStatus === 2 ? <Tooltip title={descr}><DirectionsRunIcon/></Tooltip>
        : this.props.taskStatus === 3 ? <Tooltip title={descr}><VisibilityIcon/></Tooltip>
        : this.props.taskStatus === 4 ? <Tooltip title={descr}><CancelIcon/></Tooltip>
        : "";
    }

    render(){
        return (
            <Card style={{
                backgroundColor: "#F1F1E7"
            }}>
                <CardHeader
                    avatar={
                        <Tooltip title={this.props.taskType === 1 ? "Таск" : "Баг"}>
                            <Avatar style={styles[this.props.taskType]} aria-label="task-type">
                                {this.props.taskType == 1 ? <BuildIcon style={{marginRight: 0}}/> : <BugReportIcon style={{marginRight: 0}} />}
                            </Avatar>
                        </Tooltip>
                    }
                    action={
                        <React.Fragment>
                            <Menu
                            id="project-action-menu"
                            keepMounted
                            open={this.state.actionMenuOpen}
                            onClose={this.handleClose}
                            anchorEl={this.state.anchorAction}
                            >
                                <MenuItem onClick={this.handleEditOpen}>Редактировать</MenuItem>
                                <MenuItem disabled={this.props.tracked.taskId && this.props.tracked.taskId != this.props.id} onClick={this.track}>
                                {!this.props.tracked.taskId ? "Отслеживать" : this.props.tracked.taskId == this.props.id ? "Остановить отслеживание" : "Отслеживается уже другая задача"}
                                </MenuItem>
                            </Menu>
                            <IconButton aria-label="settings" onClick={this.handleOpen}>
                                <MoreVertIcon />
                            </IconButton>
                            <Edit open={this.state.editOpen} update={this.update} handleClose={this.handleEditClose} team={this.state.team}  roles={this.props.roles} taskTypes={this.props.taskTypes} taskStatuses={this.props.taskStatuses} 
                                id={this.props.id}
                                title={this.props.title}
                                description={this.props.description}
                                effort={this.props.effort}
                                recent={this.props.recent}
                                taskType={this.props.taskType}
                                taskStatus={this.props.taskStatus}
                                severity={this.props.severity}
                                priority={this.props.priority}
                                employeeId={this.props.employeeId}
                                projectId={this.props.projectId}
                                updateDate={this.props.updateDate}/>
                        </React.Fragment>
                    }
                    title={this.props.name}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                        {this.getStatusIcon()}
                    {this.props.title}
                    </Typography>
                </CardContent>
                <CardActions disableSpacing>
                    <IconButton
                    onClick={this.handleExpandClick}
                    aria-expanded={this.state.expanded}
                    aria-label="show more"
                    >
                    <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <Paper>
                            <TableContainer>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Дата изменения</TableCell>
                                            <TableCell>{moment(this.props.updateDate).format("DD.MM.YYYY hh:mm:ss")}</TableCell>
                                        </TableRow>
                                        {this.props.employeeId ? <TableRow>
                                            <TableCell>Привязана к:</TableCell>
                                            <TableCell>{this.state.team && this.state.team.length ? this.state.team.find(t => t.id == this.props.employeeId).fullName || (`ФИО не задано (${this.props.roles.find(r => r.id == this.state.team.find(t => t.id == this.props.employeeId).roleId).name})`) : "ФИО не задано"}</TableCell>
                                        </TableRow>: <TableRow>
                                            <TableCell>Не привязана</TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>}
                                        <TableRow>
                                            <TableCell>Тип:</TableCell>
                                            <TableCell>{this.props.taskTypes.find(t => t.id == this.props.taskType).name}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Статус:</TableCell>
                                            <TableCell>{this.props.taskStatuses.find(t => t.id == this.props.taskStatus).name}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Описание:</TableCell>
                                            <TableCell>{this.props.description}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Приоритет:</TableCell>
                                            <TableCell>{this.props.priority}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Важность:</TableCell>
                                            <TableCell>{this.props.severity}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Оценка (в часах):</TableCell>
                                            <TableCell>{this.props.effort / 3600000}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Осталось до окончания плана (в часах):</TableCell>
                                            <TableCell>{Number.isInteger((this.props.recent / 3600000)) ? (this.props.recent / 3600000) : (this.props.recent / 3600000).toFixed(2)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </CardContent>
                </Collapse>
            </Card>
        );
    }
}