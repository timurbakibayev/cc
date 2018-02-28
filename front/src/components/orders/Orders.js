import React, {Component} from 'react';
import {connect} from 'react-redux';
import Order from './Order';
import * as actions from '../../actions/orders';
import * as actionsOrders from '../../actions/orders';
import * as actionsJactions from '../../actions/jactions';
import * as actionsCompany from '../../actions/company';
import * as actionsFiles from '../../actions/files';
import * as actionsGendirs from '../../actions/gendirs';
import * as actionsFields from '../../actions/fields';
import * as actionType from '../../actionTypes'
import {Switch, Route} from 'react-router-dom';
import OrderCardComponent from './OrderCard'
import Loading from '../Loading'
import NewOrderForm from './NewOrderForm'
import CloseOrderForm from './CloseOrderForm'
import ForwardOrderForm from './ForwardOrderForm'
import Button from 'material-ui/Button';

class _OrdersComponent extends Component {

    constructor(e) {
        super(e);
        this.state = {};
    }

    renderOrder(order) {
        return (
            <Order key={order.id} {...order} settings={this.props.settings} emph={
                !order.isRead && order.current_user_id === this.props.auth.user.details.id
            }  unread={
                !order.isRead && order.current_user_id !== this.props.auth.user.details.id
            }/>
        )
    }

    renderNewOrder() {
        return (
            <div>
                <NewOrderForm/>
            </div>
        )
    }


    updateOrders() {
        this.setState({loadMore: true})
        console.log("Orders.js params", this.props);
        let isOrderItem = (this.props.location.pathname.trim().match(/\/orders\/\d+/) !== null);
        if (isOrderItem) {
            let itemNo = parseInt(this.props.location.pathname.trim().toLowerCase().match(/orders\/(\d+)/)[1], 10);
            if (this.props.order.id !== itemNo) {
                console.log("Loading current order", itemNo);
                this.props.loadCurrentOrder(itemNo).then(
                    (response) => {
                        console.log("Order on load current order", this.props.order);
                        if (!this.props.order.isRead) {
                            //this.props.refreshOrders();
                            this.props.markAsRead(this.props.order.id);
                            this.props.order.isRead = true;
                        }
                        this.props.refreshCurrentCompany(this.props.order.company);
                    }
                );
                this.props.refreshFiles(itemNo);
                this.props.refreshFields(itemNo);
                this.props.refreshJactions(itemNo);
            }
            if (this.props.gendirs === null || this.props.gendirs.length === 0) {
                this.props.refreshGenDirs();
            }
        } else {
            console.log("Loading all orders");
            let subPath = this.props.location.pathname.trim().toLowerCase().match(/orders\/(.*)$/);
            if (subPath === null) {
                subPath = "open";
            } else {
                subPath = subPath[1];
            }
            subPath = subPath.toLowerCase();
            console.log("Subpath is", subPath)
            this.props.refresh(subPath);
        }
    }

    handleRefresh(event) {
        event.preventDefault();
    }

    renderErrorMessage() {
        if (this.props.errorMessage) {
            return <div className="error">{this.props.errorMessage}</div>;
        } else {
            return <div></div>;
        }
    }

    ordersSet() {
        let ordersFilteredByText = this.props.orders.filter((item) => {
            let match = true;
            this.props.ordersFilterByText.toLowerCase().split(" ").forEach((txt) => {
                if (txt.length > 0)
                    if (!((item.current_user_name.toLowerCase() +
                            item.company_name.toLowerCase() +
                            item.order_header.toLowerCase() +
                            (item.number === null ? "" : item.number.toLowerCase())
                        ).indexOf(txt) > -1)) {
                        match = false;
                    }
            });
            return match;
        });
        ordersFilteredByText = ordersFilteredByText.filter((item) => item.closed ===
        (this.props.location.pathname.toLowerCase() === "/orders/closed"));
        console.log("Orders filtered by text:", ordersFilteredByText);
        if (this.props.ordersFilter === actionType.ORDERS_TO_ME || this.props.location.pathname === "/orders/to_me")
            return (
                ordersFilteredByText.filter((item) => (
                        (item.current_user_id === this.props.auth.user.details.id) &&
                        (item.user_id !== this.props.auth.user.details.id)
                    )
                ));
        if (this.props.ordersFilter === actionType.ORDERS_FROM_ME || this.props.location.pathname === "/orders/from_me")
            return (
                ordersFilteredByText.filter((item) => (
                    (item.user_id === this.props.auth.user.details.id) &&
                    (item.current_user_id !== this.props.auth.user.details.id))
                ));
        return ordersFilteredByText;
    }

    loadMore() {
        console.log("Loading more...", this.ordersSet().length);
        let subPath = this.props.location.pathname.trim().toLowerCase().match(/orders\/(.*)$/);
        if (subPath === null) {
            subPath = "open";
        } else {
            subPath = subPath[1];
        }
        subPath = subPath.toLowerCase();
        console.log("Subpath is", subPath)
        var before = this.ordersSet().length;
        this.props.refresh(subPath, this.ordersSet().length).then(
            (response) => {
                if (before === this.ordersSet().length) {
                    this.setState({loadMore: false});
                }
            }
        );
    }

    renderListOfOrders() {
        if (this.props.errorMessage)
            return (<div>
                {this.renderErrorMessage()}
            </div>);
        var the_counter = (this.props.location.pathname.toLowerCase() === "/orders/closed"?"closed":"open");
        if (this.props.ordersFilter === actionType.ORDERS_TO_ME || this.props.location.pathname === "/orders/to_me")
            the_counter = "to_me";
        if (this.props.ordersFilter === actionType.ORDERS_FROM_ME || this.props.location.pathname === "/orders/from_me")
            the_counter = "from_me";
        var orders = this.ordersSet();

        return (<div>
            {orders.map(this.renderOrder.bind(this))}
            {!(this.props.isLoading) && orders.length <  this.props.counters[the_counter] &&
            <Button style={{margin: "2em"}} onClick={this.loadMore.bind(this)}>Загрузить ещё</Button>}
            {(this.props.isLoading) && <Loading/>}
        </div>)
    }


    renderOrderItem(values) {
        let orderNo = parseInt(values.match.params.orderNo, 10);
        if (this.props.order !== undefined)
            return (
                <div>
                    <OrderCardComponent key={orderNo} id={orderNo} {...this.props}/>
                </div>
            );
        return (
            <div>
                <Loading/>
            </div>
        )
    }

    renderCloneOrder(values) {
        let orderNo = parseInt(values.match.params.orderNo, 10);
        let orderItem = this.props.order;
        if (orderItem === null)
            return (
                <div>
                    Заявка не найдена :(
                </div>
            );
        return (<div>
            <NewOrderForm orderItem={orderItem} key={orderNo} id={orderNo}/>
        </div>)
    }

    renderCloseOrder(values) {
        let orderNo = parseInt(values.match.params.orderNo, 10);
        let orderItem = this.props.order;
        console.log("Got order item", orderItem);
        if (orderItem === null)
            return (
                <div>
                    Заявка не найдена :(
                </div>
            );
        return (<div>
            <CloseOrderForm orderItem={orderItem} key={orderNo} id={orderNo}/>
        </div>)
    }

    renderForwardOrder(values) {
        let orderNo = parseInt(values.match.params.orderNo, 10);
        let orderItem = this.props.order;
        if (orderItem === null)
            return (
                <div>
                    Заявка не найдена :(
                </div>
            );
        return (<div>
            <ForwardOrderForm orderItem={orderItem} key={orderNo} id={orderNo}/>
        </div>)
    }

    componentWillMount() {
        this.updateOrders();
        this.setState({previousLocation: this.props.location});
    }

    componentDidUpdate() {
        console.log("Did update", this.props);
        if (this.state !== null && (this.props.location !== this.state.previousLocation)) {
            this.updateOrders();
            this.setState({previousLocation: this.props.location});
        }
    }

    render() {
        console.log("Orders props", this.props);


        if (this.props.isLoadingCurrentOrder)
            return (
                <div style={{width: "100%", alignContent: "center"}}>
                    <Loading/>
                </div>
            );

        return (
            <Switch>
                <Route exact path='/' component={this.renderListOfOrders.bind(this)}/>
                <Route exact path='/orders' component={this.renderListOfOrders.bind(this)}/>
                <Route exact path='/orders/new' component={this.renderNewOrder.bind(this)}/>
                <Route exact path='/orders/to_me' component={this.renderListOfOrders.bind(this)}/>
                <Route exact path='/orders/from_me' component={this.renderListOfOrders.bind(this)}/>
                <Route exact path='/orders/closed' component={this.renderListOfOrders.bind(this)}/>
                <Route exact path='/orders/:orderNo/clone' component={this.renderCloneOrder.bind(this)}/>
                <Route exact path='/orders/:orderNo/close' component={this.renderCloseOrder.bind(this)}/>
                <Route exact path='/orders/:orderNo/forward' component={this.renderForwardOrder.bind(this)}/>
                <Route exact path='/orders/:orderNo' component={this.renderOrderItem.bind(this)}/>
            </Switch>
        );
    }
}
;

const mapStateToProps = (state) => ({
    settings: state.settings.list,
    auth: state.auth.auth,
    order: state.orders.currentOrder,
    orders: state.orders.list,
    counters: state.orders.counters,
    ordersFilter: state.orders.filter,
    ordersFilterByText: state.orders.filterByText,
    isLoading: state.orders.isLoading,
    isLoadingCurrentOrder: state.orders.isLoadingCurrentOrder,
    gendirs: state.gendirs.list,
    errorMessage: state.orders.errorMessage
});

const mapDispatchToProps = {
    refresh: actions.refreshOrders,
    refreshCurrentCompany: actionsCompany.refreshCompany,
    refreshJactions: actionsJactions.refreshJactions,
    markAsRead: actionsOrders.markAsRead,
    refreshFiles: actionsFiles.refreshFiles,
    refreshFields: actionsFields.refreshFields,
    refreshGenDirs: actionsGendirs.refreshGendirs,
    loadCurrentOrder: actions.loadCurrentOrder,
};

const OrdersComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(_OrdersComponent);

export default OrdersComponent;