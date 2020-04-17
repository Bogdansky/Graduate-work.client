import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Error from './common/Error'

export default class EditTask extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            title: this.props.title,
            description: this.props.description,
            priority: this.props.priority,
            severity: this.props.severity,
            effort: this.props.effort,
            recent: this.props.recent,
            taskType: this.props.taskType,
            taskStatus: this.props.taskStatus,
            employeeId: this.props.employeeId,
            errors: []
        }
        
        this.config = JSON.parse(localStorage.getItem("config"));

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.onInfoChange = this.onInfoChange.bind(this);
        this.update = this.update.bind(this);
    }
    
    componentWillReceiveProps(nextProps){
        this.setState({
            title: nextProps.title,
            description: nextProps.description,
            priority: nextProps.priority,
            severity: nextProps.severity,
            effort: nextProps.effort,
            recent: nextProps.recent,
            taskType: nextProps.taskType,
            taskStatus: nextProps.taskStatus,
            employeeId: nextProps.employeeId,
        })
    }

    handleClickOpen(){
        this.setState({open: true});
    }

    update(){
        let url = this.config.serverUrl + "/task/" + this.props.id;
        let body = JSON.stringify({
            title: this.state.title,
            description: this.state.description,
            effort: this.state.effort || this.props.effort,
            recent: this.state.recent || this.props.recent,
            taskType: this.state.taskType || this.props.taskType,
            taskStatus: this.state.taskStatus || this.props.taskStatus,
            severity: this.state.severity,
            priority: this.state.priority || this.props.priority,
            employeeId: this.state.employeeId,
            projectId: this.props.projectId,
            updateDate: this.props.updateDate
        });

        let options = {
            method: "PUT",
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
            if (!data){
                this.setState({errors: [{text: "Произошла ошибка. Попробуйте позже"}]})
            }
            if (!data.error){
                this.setState({open: false}, this.props.update(data.result));
            }
            else{
                this.setState({errors: [data.error]})
            }
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
            case "status":
                this.setState({taskStatus: value});
                break;
            case "effort":
                this.setState({effort: value * 3600000})
                break;
            case "recent":
                this.setState({recent: value * 3600000});
                break;
            case "priority":
                this.setState({priority: parseInt(value)});
                break;
            case "project":
                this.setState({projectId: value});
                break;
            case "employee":
                this.setState({employeeId: value});
                break;
        }
    }

  render() {
    return (
        <Dialog open={this.props.open} onClose={this.props.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Редактирование задания</DialogTitle>
            <Error data={this.state.errors} />
            <DialogContentText>* - если не требуется менять значение, то либо оставьте поле без изменений, либо удалите значение</DialogContentText>
            <DialogContent>
                <FormControl>
                    <InputLabel>Статус</InputLabel>
                    <Select name="status"
                    onChange={this.onInfoChange}
                    value={this.state.taskStatus}
                    >
                        {this.props.taskStatuses.map(r => {
                            return <MenuItem value={r.id}>{r.name}</MenuItem>
                        })}
                    </Select>
                </FormControl>
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
                label="Приоритет*"
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
                label="Оценка (в часах)*"
                name="effort"
                type="number"
                inputProps={{
                    min: 1
                }}
                value={this.state.effort / 3600000}
                onChange={this.onInfoChange}
                fullWidth
                />
                <TextField
                autoFocus
                margin="dense"
                label="Осталось до окончания плана*"
                name="recent"
                type="number"
                value={Number.isInteger((this.state.recent / 3600000)) ? (this.state.recent / 3600000) : (this.state.recent / 3600000).toFixed(2)}
                onChange={this.onInfoChange}
                fullWidth
                />
                <FormControl>
                    <InputLabel>Пользователь</InputLabel>
                    <Select name="employee"
                    onChange={this.onInfoChange}
                    value={this.state.employeeId}
                    >
                        {this.props.team ? this.props.team.map(e => {
                            return <MenuItem value={e.id}>{e.fullName || (`ФИО не задано (${this.props.roles.find(r => r.id == e.roleId).name})`)}</MenuItem>
                        }) : ""}
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button role="cancel" onClick={this.props.handleClose} color="primary">
                Отмена
                </Button>
                <Button role="save" onClick={this.update} color="primary">
                Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    )
  }
}