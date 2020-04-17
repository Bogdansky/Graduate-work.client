import React from 'react';
import { Redirect } from 'react-router-dom';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip'
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TeamView from './TeamView'
import AddEmployee from './AddEmployee'

import admin from "../admin.png"
import employee from "../employee.png"

export default class Project extends React.Component {
    static displayName = Project.name;
    
    constructor(props){
        super(props);
        this.state = {
            expanded: false,
            actionMenuOpened: false,
            redirectedToTasks: false,
            isAdmin: this.props.team.some(t => t.employeeId==localStorage.getItem("employeeId") && t.isAdmin),
            isProjectManager: this.props.team.some(t => t.employeeId == localStorage.getItem("employeeId") && t.roleId === 11),
            anchorEl: null,
            employeeId: localStorage.getItem("employeeId")
        }

        this.showTasks = this.showTasks.bind(this);
        this.handleActionMenuClose = this.handleActionMenuClose.bind(this);
        this.handleActionMenuOpen = this.handleActionMenuOpen.bind(this);
    }

    handleActionMenuClose(){
        this.setState({actionMenuOpened: false});
    }

    handleActionMenuOpen(e){
        this.setState({actionMenuOpened: true, anchorEl: e.currentTarget});
    }

    showTasks(){
        this.setState({redirectedToTasks: true})
    }

    render(){
        return (
            <Card style={{maxWidth: '345px'}}>
                <CardHeader
                    avatar={
                    <Tooltip title={this.state.isAdmin ? "Вы администратор" : "Вы участник"}>
                        <Avatar aria-label="recipe" src={this.state.isAdmin ? admin : employee} />
                    </Tooltip>
                    }
                    action={
                        <React.Fragment>
                            <Menu
                            id="project-action-menu"
                            keepMounted
                            open={this.state.actionMenuOpened}
                            onClose={this.handleActionMenuClose}
                            anchorEl={this.state.anchorEl}
                            >
                                <MenuItem onClick={this.handleActionMenuClose}>
                                    <TeamView serverUrl={this.props.serverUrl} projectId={this.props.id} onExternalClose={this.handleActionMenuClose}/>
                                </MenuItem>
                                <MenuItem onClick={this.showTasks}>
                                    {this.state.redirectedToTasks ? <Redirect to={"/board/" + this.props.id} /> : <span>Посмотреть задания</span>}
                                </MenuItem>
                                {this.props.team.find(t => t.employeeId == this.state.employeeId && t.role == 11) ? 
                                <MenuItem>
                                <AddEmployee serverUrl={this.props.serverUrl} projectId={this.props.id} roles={this.props.roles.filter(r => r.id !== 11)} onExternalClose={this.handleActionMenuClose}/>
                            </MenuItem> : ""}
                            </Menu>
                            <IconButton onClick={this.handleActionMenuOpen} aria-label="settings">
                                <MoreVertIcon />
                            </IconButton>
                        </React.Fragment>
                    }
                    title={this.props.name}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                    {this.props.description}
                    </Typography>
                </CardContent>
            </Card>
        );
    }
}
