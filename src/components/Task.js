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

export default class Task extends React.Component {
    static displayName = Task.name;

    constructor(props){
        super(props);

        this.state = {
            expanded: false
        }
    }

    render(){
        return (
            <Card>
                <CardHeader
                    avatar={
                    <Avatar aria-label="recipe">
                        R
                    </Avatar>
                    }
                    action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                    }
                    title={this.props.name}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                    {this.props.description}
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
                        <Typography paragraph>Method:</Typography>
                        <Typography paragraph>
                            Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                            minutes.
                        </Typography>
                    </CardContent>
                </Collapse>
            </Card>
        );
    }
}