import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/Button/Button';
import '../general.css';
import * as actionsOrders from '../../actions/orders';
import * as actionsCloseOrder from '../../actions/closeOrder';
import Loading from "../Loading";
import 'react-select/dist/react-select.css';
import TextField from 'material-ui/TextField';
import * as actionsFields from '../../actions/fields';

class _CloseOrderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
        }
    };

    async componentWillMount() {
        await this.props.refreshFields(this.props.id);
        console.log("New Company Form props", this.props);
        if (this.props.orderItem !== undefined) {
            this.setState({
                orderItem: this.props.orderItem,
            })
        }
        var decisions = this.props.fields.filter((field) => (field.decision === true));
        console.log("Decisions set", decisions);
        var decision = (decisions.length === 1 && decisions[0].field_value !== null && decisions[0].field_value.length > 0 ?
            decisions[0].field_description + ": " + decisions[0].field_value
            :
            "");
        var decisionIsPositive = (decisions.length === 1 ?
            decisions[0].field_value === decisions[0].decision_positive
            :
            false);
        this.setState({decision: decision});
        this.setState({decisionIsPositive: decisionIsPositive});
        console.log("Decision in component mount", decision);
        console.log("Decision is Positive? ", decisionIsPositive);
    }

    async handleSubmit(e, values) {
        e.preventDefault();
        console.log("Submitting close order form", this.state);
        await this.props.closeOrder(this.state);
        if (this.props.closedOrder.id) {
            await this.props.refresh();
            await this.props.loadCurrentOrder(this.props.closedOrder.id);
            window.location = `/#/orders/${this.props.closedOrder.id}`;
        }
        ;

    }

    render() {
        if (this.state.decision !== undefined && this.state.decision.length > 0)
            return (
                <Paper className='authForm' elevation={3}>
                    <form onSubmit={ this.handleSubmit.bind(this) } className="formLogin">
                        {this.props.orderItem ?
                            <h2>{this.props.settings.language==="russian"?"Закрытие заявки номер":"Close order number"} {this.props.orderItem.number}</h2> :
                            <h2>Ошибка! Заявка не найдена. Просим обратиться за помощью к разработчикам.</h2>
                        }
                        <div style={{
                            display: "flex",
                            color: (this.state.decisionIsPositive ? "green" : "red"),
                            flexDirection: "column",
                            margin: "auto"
                        }}>{this.state.decision}</div>
                        <div style={{display: "flex", flexDirection: "column", margin: "auto"}}>
                            <label htmlFor="comments"
                                   style={{color: "rgba(0, 0, 0, 0.54)", marginTop: "2em"}}>
                                {this.props.settings.language==="russian"?
                                "Итоговый комментарий к заявке":
                                "Resulting comment on order"
                                }
                            </label>
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
                        <div className="error">{this.props.errorMessage}</div>
                        {this.props.orderItem.length === 0 ? <Loading/> :
                            <FlatButton type="submit">{this.props.settings.language==="russian"?"Закрыть заявку":"Close Order"}</FlatButton>}
                        <div style={{zoom: 0.7, marginTop: "2em"}}>
                            <FlatButton onClick={() => {
                                window.location = `/#/orders/${this.state.orderItem.id}`;
                            }}>{this.props.settings.language==="russian"?"Вернуться к заявке":"Return to Order Card"}</FlatButton>
                        </div>
                    </form>
                </Paper>
            )
        return (
            <Paper className='authForm' elevation={3}>
                <form onSubmit={ () => {
                } } className="formLogin">
                    {this.props.orderItem ?
                        <h2>{this.props.settings.language==="russian"?"Закрытие заявки номер":"Close order number"} {this.props.orderItem.number}</h2> :
                        <h2>Ошибка! Заявка не найдена. Просим обратиться за помощью к разработчикам.</h2>
                    }
                    <div style={{marginBottom: "2em"}}></div>
                    <div className="error">{this.props.settings.language==="russian"?"Нет решения по заявке":"No decision was made on this order"}</div>
                    <FlatButton onClick={() => {
                        window.location = `/#/orders/${this.props.id}`;
                    }}>{this.props.settings.language==="russian"?"Вернуться к заявке":"Return to Order Card"}</FlatButton>
                </form>
            </Paper>
        )
    }
}

const mapStateToProps = (state) => ({
    settings: state.settings.list,
    isClosing: state.orders.isClosing,
    closedOrder: state.orders.closedOrder,
    fields: state.fields.list,
    errorMessage: state.orders.errorMessage,
});

const mapDispatchToProps = {
    refresh: actionsOrders.refreshOrders,
    refreshFields: actionsFields.refreshFields,
    loadCurrentOrder: actionsOrders.loadCurrentOrder,
    closeOrder: actionsCloseOrder.closeOrder,
};

const CloseOrderForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(_CloseOrderForm);

export default CloseOrderForm;