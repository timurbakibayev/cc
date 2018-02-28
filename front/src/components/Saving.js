import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from 'material-ui/styles';
import {CircularProgress} from 'material-ui/Progress';
import green from 'material-ui/colors/green';
import Button from 'material-ui/Button';
import CheckIcon from 'material-ui-icons/Check';
import SaveIcon from 'material-ui-icons/Save';

const styles = {
    wrapper: {
        position: 'relative',
        marginTop: "1em",
        marginBottom: "0.5em",
    },
    successButton: {
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
    progress: {
        color: green[500],
        position: 'absolute',
        left: -2,
        top: -2,
    },
};

class CircularFab extends React.Component {

    render() {
        const classes = this.props.classes;
        let buttonClass = '';

        if (this.props.success) {
            buttonClass = classes.successButton;
        }

        return (
            <div className={classes.wrapper}>
                <Button fab
                        type={this.props.type}
                        color="primary"
                        className={buttonClass}
                        onClick={this.props.handleButtonClick}
                        style={{visibility: this.props.changed || this.props.success ? "visible" : "collapse"}}
                >
                    <div style={{justifyContent: "center", display: "flex"}}>
                        {this.props.success ? <CheckIcon /> : <SaveIcon />}
                    </div>
                    <div style={{justifyContent: "center"}}>
                        {this.props.loading && <CircularProgress size={60} className={classes.progress}/>}
                    </div>
                </Button>
            </div>
        );
    }
}

CircularFab.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CircularFab);