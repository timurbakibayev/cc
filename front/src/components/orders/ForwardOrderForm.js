import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/Button/Button';
import TextField from 'material-ui/TextField';
import '../general.css';
import * as actionsOrders from '../../actions/orders';
import * as actionsNewOrders from '../../actions/newOrder';
import * as actionsForwardOrder from '../../actions/forwardOrder';
import * as actionsJactions from '../../actions/jactions';
import Loading from "../Loading";
import 'react-select/dist/react-select.css';
import AutoSuggest from '../input/AutoSuggest'
import moment from 'moment';
import { CircularProgress } from 'material-ui/Progress';

class _ForwardOrderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
            // user_to_default: this.props.orderItem.user_name,
            // user_to: {id: this.props.orderItem.user_id},
        }
    };

    componentWillMount() {
        console.log("New Company Form props", this.props);
        if (this.props.orderItem !== undefined) {
            this.setState({
                theOrder: this.props.orderItem,
                deadline_date: moment().add("1", "days").format().substring(0, 10),
                deadline_time: moment().format().substring(11, 16)
            })
        }

        this.props.prepare();
    }

    async handleSubmit(e, values) {
        e.preventDefault();
        let params = this.state;
        let error = false;
        this.setState({...this.state, error: ""});
        if (!params.user_to) {
            error = true;
            this.setState({...this.state, error: "Выберите, на кого будет направлена заявка"})
        }
        if (!params.message) {
            error = true;
            this.setState({...this.state, error: "Пожалуйста, напишите сопроводительное сообщение"})
        }
        if (error)
            return;

        console.log(this.state.error);
        console.log("Submitting new order form", this.state);
        await this.props.forwardOrder(this.state);
        await this.props.refresh();
        console.log("Forward Result", this.props.forwardedOrder)
        console.log("Error?", this.props.errorMessage)
        if (this.props.forwardedOrder !== undefined && this.props.forwardedOrder.id !== undefined) {
            await this.props.loadCurrentOrder(this.props.forwardedOrder.id);
            await this.props.refreshJactions(this.props.forwardedOrder.id);
            window.location = `/#/orders/${this.props.orderItem.id}`;
        }
    }

    render() {
        if (this.props.isPreparing)
            return <Loading/>;
        if (this.props.newOrder.users === undefined)
            return <div>loading users...</div>
        console.log("cuurent state:", this.state);
        return (
            <Paper className='authForm' elevation={3}>
                <form onSubmit={ this.handleSubmit.bind(this) } className="formLogin">
                    {this.props.orderItem ?
                        <h2>{this.props.settings.language==="russian"?"Назначение заявки номер":"Assign order number"} {this.props.orderItem.number}</h2> :
                        <h2>Заявка не найдена. Пожалуйста, сообщите об этой ошибке разработчикам.</h2>
                    }
                    <h3>Менеджер проекта: {this.props.orderItem !== undefined && this.props.orderItem.project_manager_name}</h3>
                    <div style={{marginBottom: "2em"}}>
                        <AutoSuggest
                            placeholder={this.props.settings.language==="russian"?"Кому передать заявку":"Send order to ... "}
                            name="user_to"
                            //value={this.state.user_to_default}
                            options={this.props.newOrder.users}
                            changeHandler={(d) => {
                            }}
                            selectionHandler={(suggestion) => {
                                this.setState({...this.state, user_to: suggestion})
                            }}
                        />
                    </div>
                    <div style={{display: "flex", flexDirection: "column", margin: "auto"}}>
                        <label htmlFor="deadline_date"
                               style={{color: "rgba(0, 0, 0, 0.54)"}}>{this.props.settings.language==="russian"?"Срок исполнения":"Deadline"}</label>
                        <TextField id="deadline_date"
                                   defaultValue={moment().add("1", "days").format().substring(0, 10)}
                                   style={{width: "100%"}}
                                   type={"date"} onChange={
                            (event) => {
                                this.setState({deadline_date: event.target.value})
                            }
                        }/>
                        <TextField id="deadline_time" defaultValue={moment().format().substring(11, 16)}
                                   style={{width: "100%"}}
                                   type={"time"} onChange={
                            (event) => {
                                this.setState({deadline_time: event.target.value})
                            }
                        }/>
                    </div>
                    <div style={{display: "flex", flexDirection: "column", margin: "auto"}}>
                        <label htmlFor="comments"
                               style={{color: "rgba(0, 0, 0, 0.54)", marginTop: "2em"}}>{this.props.settings.language==="russian"?"Сообщение":"Message"}</label>
                        <TextField id="deadline_time"
                                   multiline
                                   style={{width: "100%"}}
                                   type={"text"} onChange={
                            (event) => {
                                this.setState({message: event.target.value})
                            }
                        }/>
                    </div>
                    <div style={{marginBottom: "2em"}}></div>
                    <div className="error">{this.state.error}</div>
                    <div className="error">{this.props.errorMessage}</div>
                    {this.props.isForwarding ?
                        <div style={{display: "flex", flexDirection: "column", margin: "auto", alignItems: "center"}}>
                            <CircularProgress color="accent" size={50} />
                        </div>
                        :
                        <FlatButton type="submit">{this.props.settings.language==="russian"?"Направить":"Send"}</FlatButton>}
                </form>
            </Paper>
        )
    }
}

const mapStateToProps = (state) => ({
    settings: state.settings.list,
    user: state.auth.auth.user,
    role: state.auth.auth.role,
    newOrder: state.orders.newOrder,
    errorMessage: state.orders.errorMessage,
    forwardedOrder: state.orders.forwardedOrder,
    isForwarding: state.orders.isForwarding,
});

const mapDispatchToProps = {
    refresh: actionsOrders.refreshOrders,
    loadCurrentOrder: actionsOrders.loadCurrentOrder,
    refreshJactions: actionsJactions.refreshJactions,
    prepare: actionsNewOrders.prepareToCreate,
    forwardOrder: actionsForwardOrder.forwardOrder,
};

const ForwardOrderForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(_ForwardOrderForm);

export default ForwardOrderForm;