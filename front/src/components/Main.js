import React, {Component} from 'react';
import CompaniesComponent from "./companies/Companies"
import OrdersComponent from "./orders/Orders"
import CalendarComponent from "./calendar/Calendar"
import LoginComponent from "./auth/Auth"
import ReportComponent from "./reports/Report1"
import {HashRouter, Switch, Route, Link} from 'react-router-dom';
import {createMuiTheme, MuiThemeProvider} from 'material-ui/styles';
import orange from 'material-ui/colors/orange';
import classNames from 'classnames';

import * as actions from '../actions/orders'
import * as actionsSettings from '../actions/settings'

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

import ActionReceipt from  'material-ui-icons/Assignment';
import SocialDomain from 'material-ui-icons/Domain';
import Menu, {MenuItem} from 'material-ui/Menu';
import IconButton from 'material-ui/IconButton/IconButton';
import MoreVertIcon from 'material-ui-icons/MoreVert';
import DoneIcon from 'material-ui-icons/DoneAll';
import SearchForm from './orders/SearchForm'
import {connect} from 'react-redux';

import * as actionType from '../actionTypes';
import HeaderCaptionComponent from './headerCaptionComponent';

import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import logo from '../beeline_logo.png'

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
            open: true,
            openR: false,
            anchorEl: undefined,
            settingsClicked: 0,
        }
    };

    async settings() {
        var t = this.state.settingsClicked;
        this.setState({
            settingsClicked: t + 1,
        })
        if (t == 5) {
            alert("Settings mode unlocked");
        } else if (t > 5) {
            var setting = prompt("Please enter setting name", "language");
            var value = prompt("Please enter value for " + setting, "english");
            await this.props.submitSetting(setting, value);
            this.props.refreshSettings();
        }
    }

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

    sideMenu = () => {
        console.log("sideMenu props", this.props);
        if (this.props.location.pathname === "/orders" ||
            this.props.location.pathname === "/orders/to_me" ||
            this.props.location.pathname === "/" ||
            this.props.location.pathname === "/orders/closed" ||
            this.props.location.pathname === "/orders/from_me"
        )
            return (
                <div style={{width: "20em"}}>
                    <SearchForm/>
                    {/*<Button style={{color: "white"}} onClick={() => {*/}
                    {/*window.location = '/#/orders/new'*/}
                    {/*}}>Новая заявка</Button>*/}
                </div>
            );
        if (this.props.location.pathname === "/companies")
            return (
                <div style={{width: "20em"}}>
                    <SearchForm/>
                </div>
            );
        let isOrderItem = (this.props.location.pathname.trim().match(/\/orders\/\d+$/) !== null);
        if (isOrderItem) {
            let itemNo = parseInt(this.props.location.pathname.trim().toLowerCase().match(/orders\/(\d+)$/)[1], 10);
            let orderItem = this.props.order;
            console.log("Main js order item", orderItem)
            return (
                <div>
                    <Menu open={this.state.openR} anchorEl={this.state.anchorEl} id="simple-menu"
                          onRequestClose={() => {
                              this.setState({openR: false})
                          }}>
                        <MenuItem disabled={
                            orderItem == null ||
                            orderItem.closed ||
                            !this.props.user ||
                            (this.props.user.details.id !== orderItem.current_user_id &&
                            this.props.role.toLowerCase() !== "оупив" &&
                            this.props.role !== "sales")
                        } onClick={() => {
                            this.setState({openR: false});
                            window.location = `/#${this.props.location.pathname.trim()}/forward`
                        }}>{(orderItem == null || orderItem.current_user_id === orderItem.project_manager || this.props.role === "sales"?
                            (this.props.settings.language === "russian" ? actionType.ORDER_DO_FORWARD : actionType.ORDER_DO_FORWARD_EN) :
                            (this.props.settings.language === "russian" ? actionType.ORDER_DO_FORWARD_PM : actionType.ORDER_DO_FORWARD_PM_EN))}</MenuItem>
                        <MenuItem disabled={orderItem == null || !orderItem.closed || !orderItem.positive}
                                  onClick={() => {
                                      this.setState({openR: false});
                                      window.location = `/#${this.props.location.pathname.trim()}/clone`
                                  }}>{this.props.settings.language === "russian" ? actionType.ORDER_DO_CLONE : actionType.ORDER_DO_CLONE_EN}</MenuItem>
                        <MenuItem disabled={
                            orderItem == null ||
                            orderItem.closed ||
                            !this.props.user ||
                            this.props.user.details.id !== orderItem.author_user_id
                        } onClick={() => {
                            this.setState({openR: false});
                            window.location = `/#${this.props.location.pathname.trim()}/close`
                        }}>{this.props.settings.language === "russian" ? actionType.ORDER_DO_CLOSE : actionType.ORDER_DO_CLOSE_EN}</MenuItem>
                    </Menu>
                    <MoreVertIcon onClick={ this.handleClick }/>
                    {/*<IconButton color="contrast" aria-owns={this.state.open ? 'simple-menu' : null}*/}
                    {/*aria-haspopup="true"*/}
                    {/*onClick={this.handleClick}><MoreVertIcon/></IconButton>*/}
                </div>
            )
        }
    };

    componentWillMount() {
        //this.props.refreshOrders();
        this.props.refreshSettings();
    }

    render() {
        document.title = this.props.settings.title;
        const {classes} = this.props;
        console.log("Main.js props", this.props);
        return (
            <MuiThemeProvider theme={theme}>
                <HashRouter>
                    <div className={classes.root}>
                        <div className={classes.appFrame}>
                            <Drawer
                                classes={{
                                    paper: classes.drawerPaper,
                                }}
                                type="persistent"
                                anchor="left"
                                open={this.state.open}
                                onRequestClose={() => {
                                    this.setState({open: false})
                                }}
                                onClick={() => {
                                }}>
                                <div style={{zoom: 0.7}} className={classes.drawerInner}>
                                    <Link to="/auth">
                                        <div onClick={this.settings.bind(this)} className={classes.drawerHeader}>
                                            <ListItemIcon>
                                                <MailIcon />
                                            </ListItemIcon>
                                            {this.props.user && this.props.user.details ? `${this.props.user.details.first_name} ${this.props.user.details.last_name}: ${this.props.role}` :
                                                (this.props.settings.language === "russian" ? "Гость" : "Guest")}
                                            <IconButton onClick={this.handleToggle.bind(this)}>
                                                <ChevronLeftIcon />
                                            </IconButton>
                                        </div>
                                    </Link>
                                    <Divider />
                                    <List className={classes.list}>
                                        <ListSubheader>{this.props.settings.language === "russian" ? "Заявки" : "Orders"}</ListSubheader>
                                        <Link to="/orders">
                                            <ListItem button>
                                                <ListItemIcon>
                                                    <ActionReceipt />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={this.props.settings.language === "russian" ?
                                                        `${actionType.ORDERS_ALL} (${this.props.counters.open})` :
                                                        `${actionType.ORDERS_ALL_EN} (${this.props.counters.open})`
                                                    }/>
                                            </ListItem>
                                        </Link>
                                        <Link to="/orders/to_me">
                                            <ListItem button>
                                                <ListItemIcon>
                                                    <InboxIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        this.props.settings.language === "russian" ?
                                                            `${actionType.ORDERS_TO_ME} (${this.props.counters.unread}/${this.props.counters.to_me})` :
                                                            `${actionType.ORDERS_TO_ME_EN} (${this.props.counters.unread}/${this.props.counters.to_me})`
                                                    }/>
                                            </ListItem>
                                        </Link>
                                        <Link to="/orders/from_me">
                                            <ListItem button>
                                                <ListItemIcon>
                                                    <SendIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        this.props.settings.language === "russian" ?
                                                            (this.props.user === undefined || this.props.user.details === undefined ? actionType.ORDERS_FROM_ME :
                                                                `${actionType.ORDERS_FROM_ME} (${this.props.counters.from_me})`) :
                                                            (this.props.user === undefined || this.props.user.details === undefined ? actionType.ORDERS_FROM_ME_EN :
                                                                `${actionType.ORDERS_FROM_ME_EN} (${this.props.counters.from_me})`)
                                                    }/>
                                            </ListItem>
                                        </Link>
                                        <Link to="/orders/closed">
                                            <ListItem button>
                                                <ListItemIcon>
                                                    <DoneIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        this.props.settings.language === "russian" ?
                                                            (this.props.user === undefined || this.props.user.details === undefined ? actionType.ORDERS_CLOSED :
                                                                `${actionType.ORDERS_CLOSED} (${this.props.counters.closed})`) :
                                                            (this.props.user === undefined || this.props.user.details === undefined ? actionType.ORDERS_CLOSED_EN :
                                                                `${actionType.ORDERS_CLOSED_EN} (${this.props.counters.closed})`)
                                                    }/>
                                            </ListItem>
                                        </Link>
                                        <div
                                            style={{visibility: (this.props.role !== undefined && this.props.role.toLowerCase() === "sales" ? "visible" : "hidden")}}>
                                            <Link to="/orders/new">
                                                <ListItem button>
                                                    <ListItemIcon>
                                                        <NewIcon />
                                                    </ListItemIcon>
                                                    <ListItemText primary={
                                                        this.props.settings.language === "russian" ?
                                                            actionType.ORDER_NEW :
                                                            actionType.ORDER_NEW_EN
                                                    }/>
                                                </ListItem>
                                            </Link>
                                        </div>
                                        <div style={{visibility: (this.props.is_staff ? "visible" : "hidden")}}>
                                            <Divider />
                                            <ListSubheader>{this.props.settings.language === "russian" ? "Отчеты" : "Reports"}</ListSubheader>
                                            <Link to="/reports/1">
                                                <ListItem button>
                                                    <ListItemIcon>
                                                        <ReportIcon />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={this.props.settings.language === "russian" ? actionType.REPORT1 : actionType.REPORT1_EN}/>
                                                </ListItem>
                                            </Link>
                                            <Divider />
                                            <ListSubheader>{this.props.settings.language === "russian" ? "Справочники" : "Directories"}</ListSubheader>
                                            <Link to="/companies">
                                                <ListItem button>
                                                    <ListItemIcon>
                                                        <SocialDomain />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={this.props.settings.language === "russian" ? "Организации" : "Companies"}/>
                                                </ListItem>
                                            </Link>
                                            <Link to="/companies/new">
                                                <ListItem button>
                                                    <ListItemIcon>
                                                        <NewCompanyIcon />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={this.props.settings.language === "russian" ? "Новая организация" : "New Company"}/>
                                                </ListItem>
                                            </Link>
                                            <Link to="/calendar">
                                                <ListItem button>
                                                    <ListItemIcon>
                                                        <CalendarIcon />
                                                    </ListItemIcon>
                                                    <ListItemText
                                                        primary={this.props.settings.language === "russian" ? "Календарь" : "Calendar"}/>
                                                </ListItem>
                                            </Link>
                                        </div>
                                    </List>
                                </div>
                            </Drawer>
                            <AppBar className={classNames(classes.appBar, this.state.open && classes.appBarShift)}>
                                <Toolbar disableGutters>
                                    <img alt=""
                                         src={this.props.settings.logo === undefined ? logo : this.props.settings.logo}
                                         style={{width: "1.5em", marginRight: "1em", marginLeft: "2em"}}
                                         onClick={this.handleToggle.bind(this)}/>
                                    <Typography type="title" color="inherit" style={{flex: 1}}>
                                        <HeaderCaptionComponent path={ this.props.location.pathname }/>
                                    </Typography>
                                    <div style={{float: "right", marginRight: "2em"}}>
                                        {this.sideMenu()}
                                    </div>
                                </Toolbar>
                            </AppBar>

                            <main className={classNames(classes.content, this.state.open && classes.contentShift)}>
                                <div >
                                    <Switch>
                                        <Route exact path='/auth' component={ LoginComponent }/>
                                        <Route exact path='/' component={ OrdersComponent }/>
                                        <Route path='/orders' component={ OrdersComponent }/>
                                        <Route path='/reports/1' component={ ReportComponent }/>
                                        <Route path='/companies' component={ CompaniesComponent }/>
                                        <Route path='/calendar' component={ CalendarComponent }/>
                                    </Switch>
                                </div>
                            </main>
                        </div>
                    </div>
                </HashRouter>
            </MuiThemeProvider>
        );
    }
}


const mapStateToProps = (state) => ({
    settings: state.settings.list,
    user: state.auth.auth.user,
    role: state.auth.auth.role,
    is_staff: state.auth.auth.is_staff,
    order: state.orders.currentOrder,
    orders: state.orders.list,
    counters: state.orders.counters,
});

const mapDispatchToProps = {
    refreshOrders: actions.refreshOrders,
    refreshSettings: actionsSettings.refreshSettings,
    submitSetting: actionsSettings.submitSetting,
};

const MainComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(_MainComponent);

export default withStyles(styles)(MainComponent);