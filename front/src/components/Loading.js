import React, {Component} from 'react';
import './general.css'
import { CircularProgress } from 'material-ui/Progress';

class LoadingComponent extends Component {

    render() {
        return (
            <div className="loading">
                <CircularProgress color="accent" size={50} />
            </div>
        );
    }
}

export default LoadingComponent;
