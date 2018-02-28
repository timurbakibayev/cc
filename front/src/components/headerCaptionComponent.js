import React, {Component} from 'react';
import {connect} from 'react-redux';

import * as actionType from '../actionTypes';

class _HeaderCaptionComponent extends Component {
    filterCaption() {
        console.log("HeaderCaptionComponent props", this.props);
        if (this.props.isOrders !== undefined)
            return !this.props.ordersFilter?actionType.ORDERS_ALL:this.props.ordersFilter;
        if (this.props.isOrderItem === "true") {
            let itemDescription = "";
            let orderItem = this.props.order;
            if (orderItem !== null)
                itemDescription = orderItem.order_header;
            return itemDescription;
        }
        else
            return this.props.caption
    }
    render() {
        console.log("headerCaptionComponent props", this.props);
        if (this.props.path.toLowerCase().search(/orders\/(\d+)$/) > -1) {
            let itemNo = parseInt(this.props.path.toLowerCase().match(/orders\/(\d+)$/)[1],10);
            console.log("itemNo from regexp", itemNo, this.props);
            let orderItem = this.props.order;
            if (orderItem !== null)
                return (<span>{ orderItem.order_header }</span>)
            else
                return (this.props.settings.language === "russian"?
                    <span>Загрузка...</span>:
                    <span>Loading...</span>)

        }
        if (this.props.path.toLowerCase().search(/orders\/(\d+)\/clone$/) > -1) {
            let itemNo = parseInt(this.props.path.toLowerCase().match(/orders\/(\d+)\/clone$/)[1],10);
            console.log("itemNo from regexp", itemNo, this.props);
            let orderItem = this.props.order;
            if (orderItem !== null)
                return (
                    this.props.settings.language === "russian"?
                    <span>Клонирование: { orderItem.order_header }</span>:
                    <span>Clone: { orderItem.order_header }</span>
                );
            else
                return (
                    this.props.settings.language === "russian"?
                    <span>Загрузка...</span>:
                    <span>Loading...</span>
                )

        }
        if (this.props.path.toLowerCase().search(/orders\/(\d+)\/forward$/) > -1) {
            let itemNo = parseInt(this.props.path.toLowerCase().match(/orders\/(\d+)\/forward$/)[1],10);
            console.log("itemNo from regexp", itemNo, this.props);
            let orderItem = this.props.order;
            if (orderItem !== null)
                return (this.props.settings.language === "russian"?
                    <span>Назначение: { orderItem.order_header }</span>:
                    <span>Send order: { orderItem.order_header }</span>
                );
            else
                return (this.props.settings.language === "russian"?
                    <span>Загрузка...</span>:
                    <span>Loading...</span>)

        }

        if (this.props.path.toLowerCase().indexOf("reports/1") > -1)
            return (
                this.props.settings.language === "russian"?
                    <span>Отчет: {actionType.REPORT1}</span>:
                    <span>Report: {actionType.REPORT1_EN}</span>
            );
        if (this.props.path.toLowerCase().indexOf("reports/2") > -1)
            return (
                this.props.settings.language === "russian"?
                    <span>Отчет: {actionType.REPORT2}</span>:
                    <span>Report: {actionType.REPORT2_EN}</span>
            );
        if (this.props.path.toLowerCase().indexOf("orders/to_me") > -1)
            return (
                this.props.settings.language === "russian"?
                <span>Заявки: {actionType.ORDERS_TO_ME}</span>:
                <span>Orders: {actionType.ORDERS_TO_ME_EN}</span>
            );
        if (this.props.path.toLowerCase().indexOf("orders/from_me") > -1)
            return (
                this.props.settings.language === "russian"?
                <span>Заявки: {actionType.ORDERS_FROM_ME}</span>:
                <span>Orders: {actionType.ORDERS_FROM_ME_EN}</span>
            );
        if (this.props.path.toLowerCase().indexOf("orders/closed") > -1)
            return (
                this.props.settings.language === "russian"?
                <span>Заявки: {actionType.ORDERS_CLOSED}</span>:
                <span>Orders: {actionType.ORDERS_CLOSED_EN}</span>
            );
        if (this.props.path.toLowerCase().indexOf("/orders/new") > -1)
            return (
                this.props.settings.language === "russian"?
                <span>{actionType.ORDER_NEW}</span>:
                <span>{actionType.ORDER_NEW_EN}</span>
            );

        if (this.props.path.toLowerCase().indexOf("orders") > -1)
            return (
                this.props.settings.language === "russian"?
                <span>Заявки: {actionType.ORDERS_ALL}</span>:
                <span>Orders: {actionType.ORDERS_ALL_EN}</span>
            );
        if (this.props.path.toLowerCase().indexOf("companies") > -1)
            return (
                this.props.settings.language === "russian"?
                <span>Организации</span>:
                <span>Companies</span>
            );
        if (this.props.path.toLowerCase().indexOf("auth") > -1)
            return (
                this.props.settings.language === "russian"?
                <span>Учетная запись</span>:
                <span>Account</span>
            );
        if (this.props.path.toLowerCase().indexOf("calendar") > -1)
            return (
                this.props.settings.language === "russian"?
                <span>Производственный календарь</span>:
                <span>Calendar</span>
            );
        return (
            this.props.settings.language === "russian"?
            <span>Главная страница</span>:
            <span>Main Page</span>
        )
    }
}


const mapStateToProps = (state) => ({
    settings: state.settings.list,
    ordersFilter: state.orders.filter,
    orderNo: state.jactions.orderNo,
    order: state.orders.currentOrder,
});

const mapDispatchToProps = {
};

const HeaderCaptionComponent = connect(
    mapStateToProps,
    mapDispatchToProps
)(_HeaderCaptionComponent);

export default HeaderCaptionComponent;