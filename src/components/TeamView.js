import React from 'react';
import Button from '@material-ui/core/Button'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MenuItem from '@material-ui/core/MenuItem';

const columns = [
    { id: 'number', label: '№', minWidth: 10 },
    { id: 'fullname', label: 'ФИО', minWidth: 100 },
    {
      id: 'role',
      label: 'Роль',
      minWidth: 170,
      align: 'center'
    },
    {
      id: 'isAdmin',
      label: 'Администратор',
      minWidth: 170,
      align: 'right',
    }
  ];

export default class TeamView extends React.Component {
    static displayName = TeamView.name;

    constructor(props){
        super(props);

        this.state = {
            open: false,
            page: 0,
            rowsPerPage: 10,
            rows: this.props.team || []
        }

        this.handleOpen = this.handleOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.setPage = this.setPage.bind(this);
        this.setRowsPerPage = this.setRowsPerPage.bind(this);
        this.handleChangePage = this.handleChangePage.bind(this);
        this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    }

    setPage(value) {
        this.setState({page: value});
    }

    setRowsPerPage(value){
        this.setState({rowsPerPage: value});
    }

    handleChangePage(event, newPage){
        this.setPage(newPage);
    };

    handleChangeRowsPerPage(event){
        this.setRowsPerPage(+event.target.value);
        this.setPage(0);
    };

    handleOpen(){
        let url = this.props.serverUrl + `/project/${this.props.projectId}/employees`;
        let options = {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            mode: 'cors'
        };
        
        fetch(url, options).then(response => response.json(), rejected => {
            if (rejected.status == 401){
                let error = {
                    title: "Ошибка входа", 
                    description: "Неверный email или пароль. Возможно, вы не зарегистрированы"
                };
                localStorage.removeItem("userId", null);
                this.setState({errors: [error]});
            }
        })
        .then(data => {
            this.setState({open: true, rows: data.result}, this.props.onExternalClose());
        })
        .catch(e => {
            console.error(e);
        });
    }

    handleClose(){
        this.setState({open: false})
    }

    render(){
        return (
        <React.Fragment>
            <span onClick={this.handleOpen}>Просмотреть команду</span>
        <Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Команда</DialogTitle>
            <DialogContent>
            <Paper>
                <TableContainer>
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
                        {this.state.rows.slice(this.state.page * this.state.rowsPerPage, this.state.page * this.state.rowsPerPage + this.state.rowsPerPage).map((row, index) => {
                            return (
                            <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{row.fullName}</TableCell>
                                <TableCell>{row.role}</TableCell>
                                <TableCell>{row.isAdmin ? "Да" : "Нет"}</TableCell>
                            </TableRow>
                            );
                        })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={this.state.rows.length}
                rowsPerPage={this.state.rowsPerPage}
                page={this.state.page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                />
            </Paper>
            </DialogContent>
            </Dialog>
            </React.Fragment>
        );
    }
}