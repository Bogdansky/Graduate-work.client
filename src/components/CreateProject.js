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
import Error from './common/Error'

export default class CreateProject extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            name: "",
            description: "",
            errors: [],
            open: false
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
        let url = this.props.serverUrl + "/project/" + localStorage.getItem("employeeId");
        let body = JSON.stringify({
            name: this.state.name,
            description: this.state.description
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
            !data.error ? this.setState({open: false}, this.props.addProject(data.result)) : this.setState({errors: [data.error]});
        })
        .catch(e => {
            console.error(e);
        });
    }

    onInfoChange(e){
        let value = e.target.value;
        switch(e.target.name){
            case "name": 
                this.setState({name:  value});
                break;
            case "description":
                this.setState({description: value});
                break;
        }
    }

  render() {
    return (
    <div>
        <Button variant="outlined" color="primary" onClick={this.handleClickOpen}>
            Создать проект
        </Button>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Создание проекта</DialogTitle>
        <DialogContent>
            <Error data={this.state.errors} />
            <TextField
            autoFocus
            margin="dense"
            label="Название"
            name="name"
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