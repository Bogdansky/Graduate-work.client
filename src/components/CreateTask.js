import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import Grid from '@material-ui/core/Grid';
import {MuiPickersUtilsProvider,KeyboardDatePicker} from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment'

export default class EmployeeInfo extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            title: "",
            description: "",
            priority: 1,
            severity: "",
            effort: 3600000, 
            recent: 3600000, 
            taskType: null,
            projects: [],
            projectId: null
        }

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onInfoChange = this.onInfoChange.bind(this);
        this.create = this.create.bind(this);
    }
    
    handleClickOpen(){
        this.setState({open: true});
    }

    handleClose(e) {
        this.setState({open: false});  
    }

    create(){
        let url = this.props.serverUrl + "/task/";
        let body = JSON.stringify({
            title: this.state.title,
            description: this.state.description,
            effort: this.state.effort,
            recent: this.state.recent,
            taskType: this.state.taskType,
            projectId: this.state.projectId,
            severity: this.state.severity,
            priority: this.state.priority
        });

        let options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors',
            body
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
            this.setState({open: false}, this.props.updateInfo(data.result));
        })
        .catch(e => {
            console.error(e);
        });
    }

    onInfoChange(e){
        let value = e.target.value;
        switch(e.target.name){
            case "title": 
                this.setState({title:  value});
                break;
            case "description":
                this.setState({description: value});
                break;
            case "severity":
                this.setState({severity: value});
                break;
            case "type":
                this.setState({taskType: value});
                break;
            case "effort":
                this.setState({effort: value * 3600000, recent: value * 3600000})
                break;
            case "priority":
                this.setState({priority: value});
                break;
            case "project":
                this.setState({projectId: value});
                break;
        }
    }

  render() {
    return (
    <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Создать задание
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Создание задания</DialogTitle>
        <DialogContent>
            <TextField
            autoFocus
            margin="dense"
            label="Заголовок"
            name="title"
            type="text"
            value={this.state.title}
            fullWidth
            onChange={this.onInfoChange}
            />
            <TextField
            autoFocus
            margin="dense"
            label="Описание"
            name="description"
            type="text"
            value={this.state.description}
            multiline={true}
            onChange={this.onInfoChange}
            fullWidth
            />
            <TextField
            autoFocus
            margin="dense"
            label="Приоритет"
            name="priority"
            type="number"
            inputProps={{
                min: 1
            }}
            value={this.state.priority}
            onChange={this.onInfoChange}
            fullWidth
            />
            <TextField
            autoFocus
            margin="dense"
            label="Важность"
            name="severity"
            type="text"
            value={this.state.severity}
            onChange={this.onInfoChange}
            fullWidth
            />
            <TextField
            autoFocus
            margin="dense"
            label="Оценка (в часах)"
            name="effort"
            type="number"
            inputProps={{
                min: 1
            }}
            value={this.state.effort / 3600000}
            onChange={this.onInfoChange}
            fullWidth
            />
            <FormControl>
                <InputLabel>Тип</InputLabel>
                <Select name="type"
                onChange={this.onInfoChange}
                value={this.state.taskType}
                >
                    {this.props.taskTypes.map(r => {
                        return <MenuItem value={r.id}>{r.name}</MenuItem>
                    })}
                </Select>
            </FormControl>
            <FormControl>
                <InputLabel>Проект</InputLabel>
                <Select name="project"
                onChange={this.onInfoChange}
                value={this.state.projectId}
                >
                    {this.props.projects.map(r => {
                        return <MenuItem value={r.id}>{r.name}</MenuItem>
                    })}
                </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button role="cancel" onClick={this.handleClose} color="primary">
            Отмена
            </Button>
            <Button role="save" onClick={this.create} color="primary">
            Сохранить
            </Button>
        </DialogActions>
        </Dialog>
    </div>
    )
  }
}