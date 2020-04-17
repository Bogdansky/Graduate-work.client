import React from 'react';
import Alert from '@material-ui/lab/Alert';

export default class Error extends React.Component {
    static displayName = Error.name;

    constructor(props){
        super(props);
    }

    render(){
        if (this.props.data && this.props.data.length){
        return <Alert color="error" severity="error" style={{width: '100%', textAlign: "left"}}>{this.props.data.map(e => {
            return <p><strong>{e.description || e.text}</strong></p>
        })}</Alert>
        }
        return '';
    }
}