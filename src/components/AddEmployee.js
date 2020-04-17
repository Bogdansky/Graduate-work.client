import React from 'react';
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Toolbar from '@material-ui/core/Toolbar'
import SearchIcon from '@material-ui/icons/Search';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import { AppBar, Grid, Slider, Typography } from '@material-ui/core';
import Error from './common/Error'
import Info from './common/Info'

const columns = [
    { id: 'number', label: '№', minWidth: 10 },
    { id: 'fullname', label: 'ФИО', minWidth: 100 },
    {
      id: 'role',
      label: 'Роль',
      minWidth: 170,
      align: 'left'
    },
    {
      id: 'rate',
      label: 'Рейтинг',
      minWidth: 10,
      align: 'left',
    },
    {
        id: 'project-count',
        label: 'Число проектов'
    }
  ];

  function valuetext(value){
      return value + "%";
  }

export default class AddEmployee extends React.Component {
    static displayName = AddEmployee.name;

    constructor(props){
        super(props);

        this.state = {
            open: false,
            employees: [],
            loading: false,
            hintOpen: false,
            anchorEl: null,
            role: 0,
            minProjectNumber: 0,
            maxProjectNumber: 0,
            errors: [],
            minRate: 0,
            maxRate: 100,
            success: [],
            warning: []
        }

        this.onInfoChange = this.onInfoChange.bind(this);
        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handlePopoverOpen = this.handlePopoverOpen.bind(this);
        this.handlePopoverClose = this.handlePopoverClose.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.setRate = this.setRate.bind(this);
        this.validate = this.validate.bind(this);
        this.invite = this.invite.bind(this);
    }

    handleOpen(){
        this.setState({open: true}, this.props.onExternalClose())
    }

    handleClose(){
        this.setState({open: false})
    }

    handlePopoverOpen(e){
        this.setState({hintOpen: true, anchorEl: e.currentTarget})
    }

    handlePopoverClose(){
        this.setState({hintOpen: false, anchorEl: null})
    }

    handleSearch(){
        let {role,minProjectNumber,maxProjectNumber,minRate,maxRate} = this.state;
        debugger
        if (!this.validate()) return;

        let u = new URLSearchParams({projectId: this.props.projectId,role,minProjectNumber,maxProjectNumber,minRate,maxRate});
        let url = this.props.serverUrl + `/employee/search?${u.toString()}`;
        let options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors'
        };

        fetch(url, options)
            .then(res => res.json())
            .then(data => {
                data.error ? this.setState({errors: [data.error]}) : this.setState({employees: data.result});
            })
            .catch(e => console.error(e));
    }

    onInfoChange(e,newValue){
        debugger
        let value = e.target ? e.target.value : e.value ? e.value : e;
        switch(e.target.name){
            case "role": 
                this.setState({role: value});
                break;
            case "min-project-number":
                this.setState({minProjectNumber: value});
                break;
            case "max-project-number":
                this.setState({maxProjectNumber: value});
                break;
        }
    }

    setRate(e, newValue){
        this.setState({minRate: newValue[0], maxRate: newValue[1]});
    }

    validate(){
        let errors = [];
        if (this.state.minProjectNumber + this.state.maxProjectNumber != 0 && this.state.minProjectNumber >= this.state.maxProjectNumber){
            errors.push({text: "Минимальное число проектов должно быть больше максимального"})
        }
        this.setState({errors});
        return !errors.length;
    }

    invite(e){
        this.setState({warning: [], success: []})
        let id = e.currentTarget.value;
        let employeeId = localStorage.getItem("employeeId");
        let url = this.props.serverUrl + `/project/${this.props.projectId}/employee/${employeeId}`;
        let options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors',
            body: JSON.stringify({id: parseInt(id)})
        };
        fetch(url, options).then(res => res.json(), rej => console.error(rej))
            .then(data => {
                if (data.error){
                    this.setState({errors: [data.error]});
                } else {
                    data.result.success ? 
                        this.setState({success: [{text: "Приглашение успешно отправлено"}]})
                        : 
                        this.setState({warning: [{text: "Не удалось отправить приглашение"}]});
                }
            })
            .catch(e => console.error(e))
    }

    render(){
        return (
        <React.Fragment>
            <span onClick={this.handleOpen} disabled={this.state.loading}>Добавить сотрудника</span>
            {this.state.loading && <CircularProgress size={40} />}
        <Dialog open={this.state.open} onClose={this.handleClose} fullScreen={true} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Добавление сотрудника</DialogTitle>
            <AppBar>
                <Toolbar id="primary-bar">
                    <IconButton edge="start" color="inherit" aria-label="search" onClick={this.handleSearch}>
                        <SearchIcon/>
                    </IconButton>
                    <Grid container direction="row" spacing={3}>
                        <Grid item xs={3}>
                            <Select name="role" style={{width: "100%", color: "white"}}
                            onChange={this.onInfoChange}
                            value={this.state.role}
                            >
                                {this.props.roles.map(r => {
                                    return <MenuItem value={r.id}>{r.name}</MenuItem>
                                })}
                            </Select>
                        </Grid>
                        <Grid item xs={3}>
                            <TextField style={{width: "100%"}}
                            label="Минимальное число проектов"
                            name="min-project-number"
                            type="number"
                            onChange={this.onInfoChange}
                            value={this.state.minProjectNumber}
                            inputProps={{
                                min: 0
                            }}
                            />
                        </Grid>
                        <Grid item xs={3}>
                            <TextField style={{width: "100%"}}
                            label="Максимальное число проектов"
                            name="max-project-number"
                            type="number"
                            onChange={this.onInfoChange}
                            value={this.state.maxProjectNumber}
                            inputProps={{
                                min: 0
                            }}
                            />
                        </Grid>
                        <Grid item container direction="row" xs={2}>
                            <Typography id="rate-slider" color="inherit">Рейтинг</Typography>
                            <Slider color="secondary"
                                value={[this.state.minRate, this.state.maxRate]}
                                onChange={this.setRate}
                                valueLabelDisplay="auto"
                                aria-labelledby="rate-slider"
                                getAriaValueText={valuetext}
                                name="rate"
                            />
                        </Grid>
                    </Grid>
                    <IconButton edge="end" color="inherit" onClick={this.handleClose} aria-label="close">
                        <CloseIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Error data={this.state.errors}/>
            <Info success={this.state.success} warning={this.state.warning} />
            <DialogContent>
            <Paper>
                {this.state.employees && this.state.employees.length ? <TableContainer>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.employees.map((row, index) => <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.employee.fullName ? row.employee.fullName : "Не задано"}</TableCell>
                                <TableCell>{this.props.roles.find(r => r.id === row.employee.roleId).name}</TableCell>
                                <TableCell>{row.rate ? row.rate + "%" : "Нет данных"}</TableCell>
                                <TableCell>{row.projectNumber}</TableCell>
                                <TableCell>
                                    <Button color="primary" onClick={this.invite} value={row.employee.id}>Пригласить</Button>
                                </TableCell>
                            </TableRow>)}
                        </TableBody>
                    </Table>
                </TableContainer> : ""}
            </Paper>
            </DialogContent>
            </Dialog>
            </React.Fragment>
        );
    }
}