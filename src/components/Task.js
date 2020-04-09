import React from 'react';

export default class Task extends React.Component {
    static displayName = Task.name;

    constructor(props){
        super(props);
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
                    title={this.props.task.name}
                />
                <CardContent>
                    <Typography variant="body2" color="textSecondary" component="p">
                    {this.props.project.description}
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