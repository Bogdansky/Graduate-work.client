import React from 'react';
import Alert from '@material-ui/lab/Alert';

export default class Info extends React.Component {
    static displayName = Info.name;

    constructor(props){
        super(props);
    }

    render(){
        if (this.props.success && this.props.success.length){
        return <Alert color="success" severity="success" style={{width: '100%'}}>{this.props.success.map(e => {
            return <p><strong>{e.description || e.text}</strong></p>
        })}</Alert>
        }
        if (this.props.warning && this.props.warning.length){
            return <Alert severity="warning" style={{width: '100%'}}>{this.props.warning.map(e => {
                return <p><strong>{e.description || e.text}</strong></p>
            })}</Alert>
        }
        return '';
    }
}