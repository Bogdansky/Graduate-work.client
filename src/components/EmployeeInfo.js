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
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import moment from 'moment'

export default class EmployeeInfo extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            open: false,
            firstName: this.props.info.firstName,
            secondName: this.props.info.secondName,
            patronymic: this.props.info.patronymic,
            role: this.props.info.roleId,
            birthday: this.props.info.birthday
        }

        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.onInfoChange = this.onInfoChange.bind(this);
        this.sendUpdate = this.sendUpdate.bind(this);
        this.setBirthday = this.setBirthday.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            firstName: nextProps.info.firstName, 
            secondName: nextProps.info.secondName, 
            patronymic: nextProps.info.patronymic,
            role: nextProps.info.roleId,
            birthday: nextProps.info.birthday
        });
    }

    handleClickOpen(){
        this.setState({open: true});
    }

    handleClose(e) {
        this.setState({open: false});  
    }

    sendUpdate(){
        let url = this.props.serverUrl + "/employee/" + this.props.info.id;
        let body = JSON.stringify({
            firstName: this.state.firstName,
            secondName: this.state.secondName,
            patronymic: this.state.patronymic,
            roleId: this.state.role,
            birthday: this.state.birthday
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
            this.setState({open: false}, this.props.updateInfo(data.result));
        })
        .catch(e => {
            console.error(e);
        });
    }

    onInfoChange(e){
        debugger
        let value = e.target.value;
        switch(e.target.name){
            case "first": 
                this.setState({firstName:  value});
                break;
            case "second":
                this.setState({secondName: value});
                break;
            case "patronymic":
                this.setState({patronymic: value});
                break;
            case "role":
                this.setState({role: value});
                break;
        }
    }

    setBirthday(value){
        this.setState({birthday: value});
    }

  render() {
    return (
    <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Заполнить информацию о себе
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Личная информация</DialogTitle>
        <DialogContent>
            <DialogContentText>
            Для того, чтобы остальные немного вас знали, заполните поля.
            </DialogContentText>
            <TextField
            autoFocus
            margin="dense"
            label="Имя"
            name="first"
            type="text"
            value={this.state.firstName}
            fullWidth
            onChange={this.onInfoChange}
            />
            <TextField
            autoFocus
            margin="dense"
            label="Фамилия"
            name="second"
            type="text"
            value={this.state.secondName}
            onChange={this.onInfoChange}
            fullWidth
            />
            <TextField
            autoFocus
            margin="dense"
            label="Отчество"
            name="patronymic"
            type="text"
            value={this.state.patronymic}
            onChange={this.onInfoChange}
            fullWidth
            />
            <FormControl>
                <InputLabel>Роль</InputLabel>
                <Select name="role"
                onChange={this.onInfoChange}
                value={this.state.role}
                >
                    {this.props.roles.map(r => {
                        return <MenuItem value={r.id}>{r.name}</MenuItem>
                    })}
                </Select>
            </FormControl>
        </DialogContent>
        <DialogActions>
            <Button role="cancel" onClick={this.handleClose} color="primary">
            Отмена
            </Button>
            <Button role="save" onClick={this.sendUpdate} color="primary">
            Сохранить
            </Button>
        </DialogActions>
        </Dialog>
    </div>
    )
  }
}