import React, {Component} from 'react';
import ChatsComponent from "./chats/Chats"
import {HashRouter, Switch, Route, Link} from 'react-router-dom';
import {createMuiTheme, MuiThemeProvider} from 'material-ui/styles';
import orange from 'material-ui/colors/orange';
import classNames from 'classnames';

import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';

import List, {ListItem, ListItemIcon, ListItemText, ListSubheader} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import InboxIcon from 'material-ui-icons/AssignmentReturned';
import SendIcon from 'material-ui-icons/Send';
import MailIcon from 'material-ui-icons/Face';
import NewIcon from 'material-ui-icons/CreateNewFolder';
import CalendarIcon from 'material-ui-icons/Today';
import ReportIcon from 'material-ui-icons/Note';
import NewCompanyIcon from 'material-ui-icons/FiberNew';
import ChevronLeftIcon from 'material-ui-icons/ChevronLeft';
import {withStyles} from 'material-ui/styles';

import ActionReceipt from 'material-ui-icons/Assignment';
import SocialDomain from 'material-ui-icons/Domain';
import Menu, {MenuItem} from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import DoneIcon from 'material-ui-icons/DoneAll';
// import {connect} from 'react-redux';
import logo from '../logo.svg'

import HeaderCaptionComponent from './headerCaptionComponent';

import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

const drawerWidth = 200;

const theme = createMuiTheme({
    status: {
        danger: orange[500],
    },
    overrides: {
        MuiInput: {
            root: {
                color: 'contrast'
            }
        },
        MuiToolbar: {
            root: {
                background: '#546E7A',
                color: '#FBC300',
            }
        },
        MuiButton: {
            // Name of the styleSheet
            root: {
                //background: 'linear-gradient(to bottom, #050703 20%, #FBC300 40%, #050703 60%, #FBC300 80%, #050703 100%)',
                //background: 'linear-gradient(to bottom, 0 3px 0 0 #ebb16f, 0 4px 0 0 #d99a59, 0 4px 8px 0 rgba(102,55,0,.4))',
                borderRadius: 10,
                border: 0,
                color: 'contrast',
                height: "1em",
                boxShadow: '0 3px 5px 2px rgba(152,101,0,10)',
            },
        },
    }
});


const styles = theme => ({
    root: {
        width: '100%',
        height: '100%',
        zIndex: 1,
        overflow: 'hidden',
    },
    appFrame: {
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
    },
    appBar: {
        position: 'absolute',
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 20,
    },
    hide: {
        display: 'none',
    },
    drawerPaper: {
        position: 'relative',
        height: '100%',
        background: "#ffffff",
        width: drawerWidth,
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        height: 56,
        [theme.breakpoints.up('sm')]: {
            height: 64,
        },
    },
    content: {
        width: '100%',
        marginLeft: -drawerWidth,
        //padding: "1em",
        flexGrow: 1,
        overflowY: 'auto',
        backgroundColor: theme.palette.background.default,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginTop: 67,
        [theme.breakpoints.up('sm')]: {
            content: {
                height: 'calc(100% - 64px)',
                marginTop: 64,
            },
        },
    },
    contentShift: {
        marginLeft: 0,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
});

class _MainComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            openR: false,
            anchorEl: undefined,
            settingsClicked: 0,
        }
    };

    handleToggle() {
        this.setState({
            open: !this.state.open,
            openR: false,
        });
    }

    handleClick = event => {
        this.setState({open: this.state.open, openR: true, anchorEl: event.currentTarget});
    };

    handleRequestClose = () => {
        this.setState({open: this.state.open, openR: false});
    };

    hide() {
        this.setState({open: false});
        this.props.ordersByText("");
    }

    componentWillMount() {
        //this.props.refreshOrders();
        // this.props.refreshSettings();
    }

    render() {
        document.title = "Chat Center";

        const {classes} = this.props;
        console.log("Main.js props", this.props);
        return (
            <MuiThemeProvider theme={theme}>
                <HashRouter>
                    <div>
                        <div>
                            <Switch>
                                <Route exact path='/' component={ChatsComponent}/>
                            </Switch>
                        </div>
                    </div>
                </HashRouter>
            </MuiThemeProvider>
        );
    }
}


const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

// const MainComponent = connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(_MainComponent);

export default withStyles(styles)(_MainComponent);