import React, {Component} from 'react';
import Paper from 'material-ui/Paper';
import {connect} from 'react-redux';
import FlatButton from 'material-ui/Button/Button';
import '../general.css';
import * as actionsOrders from '../../actions/orders';
import * as actionsNewOrders from '../../actions/newOrder';
import * as actionsCompanies from '../../actions/companies';
import Loading from "../Loading";
import 'react-select/dist/react-select.css';
import AutoSuggest from '../input/AutoSuggest'

class _NewOrderForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: "",
        }
    };

    componentWillMount() {
        console.log("New Company Form props", this.props);
        if (this.props.orderItem !== undefined) {
            this.setState({
                orderSubType: {
                    id: this.props.orderItem.order_sub_type,
                    caption: this.props.orderItem.order_sub_type_text},
                company: {
                    id: this.props.orderItem.company,
                    caption: this.props.orderItem.company_name
                },
                cloneOrder: this.props.orderItem,
            })
        }
        if (this.props.newOrder.users === undefined || this.props.newOrder.users.length === 0) {
            this.props.prepare();
        }
        if (!(this.props.companiesLoaded)) {
            this.props.loadCompanies();
        }
    }

    async handleSubmit(e, values) {
        e.preventDefault();
        let params = this.state;
        let error = false;
        let errorOrderType = "Выберите тип заявки";
        let errorOrderSubType = "Выберите тип услуги";
        let errorCompany = "Выберите организацию";
        let errorManager = "Выберите проектного менеджера";
        if (this.props.settings.language !== "russian") {
            errorOrderType = "Choose order type";
            errorOrderSubType = "Choose order subtype";
            errorCompany = "Choose company";
            errorManager = "Choose project manager";
        }
        this.setState({...this.state, error: ""});
        if (!params.orderType) {
            error = true;
            this.setState({...this.state, error: errorOrderType})
        }
        if (!params.orderSubType && this.props.newOrder.orderSubTypes.length > 0) {
            error = true;
            this.setState({...this.state, error: errorOrderSubType})
        }
        if (!params.company) {
            error = true;
            this.setState({...this.state, error: errorCompany})
        }
        if (!params.manager) {
            error = true;
            this.setState({...this.state, error: errorManager})
        }
        if (error)
            return;

        console.log(this.state.error)
        console.log("Submitting new order form", this.state);
        await this.props.createOrder(this.state);
        if (this.props.createdOrder.id) {
            await this.props.refresh();
            window.location = `/#/orders/${this.props.createdOrder.id}`;
        } else {
            this.setState({error: "Ошибка"})
        }
    }

    render() {
        if (this.props.isPreparing || this.props.companiesLoading)
            return <Loading/>;
        //TODO: If failed to prepare, show the corresponding message
        if (this.props.newOrder.users === undefined)
            return <div>loading users...</div>
        if (this.props.companies === undefined)
            return <div>loading companies...</div>
        if (this.props.newOrder.orderTypes === undefined)
            return <div>loading order types...</div>
        if (this.props.newOrder.orderSubTypes === undefined)
            return <div>loading order subtypes...</div>
        console.log("NewOrderForm orderItem:", this.props.orderItem);
        console.log("Ready users:", this.props.newOrder.users);
        console.log("Ready companies:", this.props.companies);
        console.log("Ready order types:", this.props.newOrder.orderTypes);
        console.log("Ready order subtypes:", this.props.newOrder.orderSubTypes);
        var allowedOrderTypes = this.props.newOrder.orderTypes.filter((orderType) => (orderType.prerequisite === (this.props.orderItem?this.props.orderItem.order_type:null)));
        if (allowedOrderTypes !== undefined && allowedOrderTypes.length ===1 && this.state.orderType === undefined) {
            this.setState({orderType: allowedOrderTypes[0]});
        }
        return (
            <Paper className='authForm' elevation={3}>
                <form onSubmit={ (e)=>{e.preventDefault()} } className="formLogin">
                    {this.props.orderItem?
                        <h2>{(this.props.settings.language === "russian"?"Клонирование заявки номер ":"Clone order no. ")} {this.props.orderItem.number}</h2>:
                        <h2>{this.props.settings.language === "russian"?"Новая заявка":"New Order"}</h2>
                    }
                    <div style={{marginBottom: "2em"}}>
                        <AutoSuggest className="react-autosuggest"
                                     placeholder={this.props.settings.language === "russian"?"Организация":"Company"}
                                     name="companyName"
                                     value={this.props.orderItem === undefined?"":this.props.orderItem.company_name}
                                     options={this.props.companies}
                                     changeHandler = {(d)=> {}}
                                     selectionHandler={(suggestion) => {
                                         console.log("Selected company", suggestion);
                                         this.setState({...this.state, company: suggestion})
                                     }}
                        />
                    </div>
                    <div style={{marginBottom: "2em"}}>
                        <AutoSuggest
                            placeholder={this.props.settings.language === "russian"?"Тип заявки":"Order Type"}
                            name="orderType"
                            value={ allowedOrderTypes !== undefined && allowedOrderTypes.length ===1?allowedOrderTypes[0].caption:""}
                            options={ allowedOrderTypes }
                            changeHandler = {(d)=> {}}
                            selectionHandler={(suggestion) => {
                                console.log("Selected order type", suggestion);
                                this.setState({...this.state, orderType: suggestion})
                            }}
                        />
                    </div>
                    {this.props.newOrder.orderSubTypes.length > 0 && <div style={{marginBottom: "2em"}}>
                        <AutoSuggest
                            placeholder={this.props.settings.language === "russian"?"Услуга":"Order Subtype"}
                            name="orderSubType"
                            value={this.props.orderItem === undefined?"":this.props.orderItem.order_sub_type_text}
                            options={this.props.newOrder.orderSubTypes}
                            changeHandler = {(d)=> {}}
                            selectionHandler={(suggestion) => {
                                console.log("Selected order sub type", suggestion);
                                this.setState({...this.state, orderSubType: suggestion})
                            }}
                        />
                    </div>}
                    <div style={{marginBottom: "2em"}}>
                        <AutoSuggest
                            placeholder={this.props.settings.language === "russian"?"Проектный менеджер":"Project Manager"}
                            name="projectManager"
                            options={this.props.newOrder.users}
                            changeHandler = {(d)=> {}}
                            selectionHandler={(suggestion) => {
                                console.log("Selected project manager", suggestion);
                                this.setState({...this.state, manager: suggestion})
                            }}
                        />
                    </div>
                    <div style={{marginBottom: "2em"}}></div>
                    <div className="error">{this.state.error}</div>
                    {this.props.newOrder.length === 0 ? <Loading/> : <FlatButton onClick={this.handleSubmit.bind(this)}>{this.props.settings.language === "russian"?"Создать":"Create"}</FlatButton>}
                </form>
            </Paper>
        )
    }
}

const mapStateToProps = (state) => ({
    settings: state.settings.list,
    orders: state.orders.list,
    errorMessage: state.orders.errorMessage,
    isPreparing: state.orders.isPreparing,
    companies: state.companies.list,
    companiesLoading: state.companies.isLoading,
    companiesLoaded: state.companies.loaded,
    createdOrder: state.orders.createdOrder,
    newOrder: state.orders.newOrder,
});

const mapDispatchToProps = {
    refresh: actionsOrders.refreshOrders,
    prepare: actionsNewOrders.prepareToCreate,
    createOrder: actionsNewOrders.createNewOrder,
    loadCompanies: actionsCompanies.refreshCompanies,
};

const NewOrderForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(_NewOrderForm);

export default NewOrderForm;