import React, {Component} from 'react';
import {Field, reduxForm} from 'redux-form';
import {renderSearchField} from '../formElements/fields';
import '../general.css';
import * as actions from '../../actions/orders';

import {connect} from 'react-redux';


const validate = values => {
    const errors = {}
    const requiredFields = ['username', 'password']
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'Поле обязательно'
        }
    })
    if (values.email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }
    return errors
}

class _SearchForm extends Component {

    handleChanges = (values) => {
        this.props.ordersByText(values.target.value);
    }

    render() {
        return (
            <Field style={{width: "100%"}} name="text" component={ renderSearchField }
                   placeholder={this.props.settings.language === "russian"?"Поиск":"Search"} className="formSearch" onChange={
                this.handleChanges.bind(this)}/>
        )
    }
}

_SearchForm = reduxForm({
    form: 'searchOrders',
    fields: [],
    validate,
})(_SearchForm)

const mapStateToProps = (state) => ({
    settings: state.settings.list,
    ordersFilter: state.orders.filter,
});

const mapDispatchToProps = {
    ordersByText: actions.filterOrdersByText
};

const SearchForm = connect(
    mapStateToProps,
    mapDispatchToProps
)(_SearchForm);


export default SearchForm;