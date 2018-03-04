import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
//https://github.com/brandonmowat/react-chat-ui:
import {ChatFeed, Message} from 'react-chat-ui'
import Typography from 'material-ui/Typography';

import Paper from 'material-ui/Paper';

import SendIcon from 'material-ui-icons/Send';
import SendingIcon from 'material-ui-icons/CloudCircle';


import './../general.css'
import {Link} from 'react-router-dom';

import Loading from "../Loading";
import Saving from "../Saving";
import Grid from 'material-ui/Grid';
import Collapse from 'material-ui/transitions/Collapse';

const styles = {
    root: {
        padding: "1em",
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    gridList: {
        marginTop: "1%",
        width: "95%",
        overflowY: 'auto',
    },
};

const isDevBuild = (process.env.NODE_ENV === 'development');
const URL = isDevBuild ? "http://localhost:8000/" : "/";
const token = "default_token";
const url_messages = `${URL}messages/`;
const url_new_message = `${URL}new_message/`;

class _ChatsComponent extends Component {

    constructor(e) {
        super(e);
        this.messagesRef = {};
        this.state = {
            editField: {},
            customers: [],
        }
    }

    componentWillMount() {
        this.setState({mounted: true});
        console.log("Chat Component Will Mount", this.props);
    }

    async refreshMessages() {
        // console.log("Requesting from " + url_messages + "...");
        var response = await(fetch(
            url_messages,
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${ token }`
                }
            }
        ));
        const text = await response.text();
        if (response.status === 200) {
            const result = JSON.parse(text).sort((i, j) => i.order < j.order ? -1 : 1);
            let customers = this.state.customers;
            result.forEach((customer) => {
                customer.expanded = true;
                customer.sending = false;
                let messageObjects = [];
                customer.messages.forEach((message) => {
                    messageObjects.push(new Message(message));
                });
                customer.messages = messageObjects;
                if (customers.filter((c)=>c.id === customer.id).length === 0) {
                    customers.push(customer);
                    customers = customers.sort((i, j) => i.order < j.order ? -1 : 1);
                    this.setState({customers: customers});
                    setTimeout(
                        ()=>{
                            try {
                                const objDiv = findDOMNode(this).querySelector('.chat' + customer.id);
                                objDiv.scrollTop = 100000;
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        ,500)
                } else {
                    let the_customer = customers.filter((c)=>c.id === customer.id)[0];
                    if (customer.reply.length > 0 && the_customer.reply.length === 0)
                        the_customer.reply = customer.reply;
                    the_customer.name = customer.name;
                    if (the_customer.messages.length !== customer.messages.length) {
                        the_customer.messages = customer.messages;
                        this.setState({
                            customers: [
                                ...this.state.customers.filter((c) => c.id !== the_customer.id),
                                the_customer]
                                .sort((i, j) => i.order < j.order ? -1 : 1)
                        });
                        setTimeout(
                            ()=>{
                                try {
                                    const objDiv = findDOMNode(this).querySelector('.chat' + customer.id);
                                    objDiv.scrollTop = 100000;
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                            ,500)
                    }
                }
            });
        }
    }

    componentDidMount() {
        setInterval(this.refreshMessages.bind(this), 3000);
        this.state.customers.forEach((customer) => {
            try {
                const objDiv = findDOMNode(this).querySelector('.chat' + customer.id);
                objDiv.scrollTop = 100000;
            } catch (e) {
                console.log(e);
            }
        })
    }

    onBreakpointChange = (breakpoint) => {
        this.setState({
            currentBreakpoint: breakpoint
        });
    };

    async onMessageSubmit(customer, e) {
        e.preventDefault();
        if (customer.sending)
            return;
        console.log("New message push customer ", customer.name + ": " + customer.reply);
        customer.sending = true;
        this.setState({
            customers: [
                ...this.state.customers.filter((c) => c.id !== customer.id),
                customer]
                .sort((i, j) => i.order < j.order ? -1 : 1)
        });

        const response = await(fetch(
            url_new_message,
            {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `JWT ${ token }`
                },
                body: JSON.stringify({
                    customer: customer.id,
                    message: customer.reply,
                }),
            }
        ));


        const text = await response.text();
        if (response.status === 201) {

            customer.messages.push(
                new Message({id: 0, message: customer.reply}),
            );
            customer.sending = false;
            customer.reply = "";
            this.setState({
                customers: [
                    ...this.state.customers.filter((c) => c.id !== customer.id),
                    customer]
                    .sort((i, j) => i.order < j.order ? -1 : 1)
            });
            try {
                const objDiv = findDOMNode(this).querySelector('.chat' + customer.id);
                objDiv.scrollTop = 100000;
            } catch (e) {
                console.log(e);
            }
        } else {
            alert("We've got problem: " + response.status);
            customer.sending = false;
            this.setState({
                customers: [
                    ...this.state.customers.filter((c) => c.id !== customer.id),
                    customer]
                    .sort((i, j) => i.order < j.order ? -1 : 1)
            });
        }
    }

    renderSingleChat(customer) {
        var h17 = customer.expanded ? "17em" : "auto";
        var h15 = customer.expanded ? "15em" : "auto";

        return (
            <div key={customer.id} style={{display: "flex", flexFlow: "column"}}>
                <Paper elevation={10} style={{width: "300px", maxWidth: "300px", margin: "10px", height: h17}}>
                    <Typography onClick={() => {
                        customer.expanded = !customer.expanded;
                        this.setState({customers: [...this.state.customers.filter((c) => c.id !== customer.id), customer].sort((i, j) => i.order < j.order ? -1 : 1)});
                        const el = this;
                        setTimeout(function () {
                            el.setState({customers: [...el.state.customers.filter((c) => c.id !== customer.id)].sort((i, j) => i.order < j.order ? -1 : 1)});
                        }, 700);

                    }} className="cardExpandableHeader" align="center"
                                type="headline" component="h3" style={{height: "2em"}}>
                        <span style={{fontSize: "1.6em", fontWeight: "bold"}}>{customer.name}</span>
                    </Typography>
                    <Collapse style={{overflowY: 'auto', overflowX: 'auto', height: h15}}
                              in={customer.expanded}
                              unmountOnExit
                              className={"chat" + customer.id}
                    >
                        <div style={{display: "flex", height: h15, flexFlow: "column"}}>
                            <div style={{zoom: 0.7, margin: 5, marginBottom: "1.5em"}}>
                                <ChatFeed
                                    messages={customer.messages}
                                    isTyping={customer.is_typing}
                                    hasInputField={false}
                                    showSenderName
                                    bubblesCentered={false}
                                />
                            </div>
                        </div>
                    </Collapse>
                </Paper>
                <Paper key={10000 + customer.id} elevation={10}
                       style={{width: "300px", marginTop: -10, marginLeft: 10, height: "2em"}}>
                    <form onSubmit={e => this.onMessageSubmit(customer, e)}>
                        <div style={{display: "flex", flexFlow: "row"}}>
                            <div style={{flex: 1}}>
                                <input
                                    style={{width: "95%", border: 0, fontSize: "1em", outline: "none"}}
                                    placeholder="Введите сообщение..."
                                    className="message-input"
                                    value={customer.reply}
                                    onChange={(e) => {
                                        customer.reply = e.target.value;
                                        this.setState({customers: [...this.state.customers.filter((c) => c.id !== customer.id), customer].sort((i, j) => i.order < j.order ? -1 : 1)});
                                    }}
                                />
                            </div>
                            {!customer.sending && <div onClick={e => this.onMessageSubmit(customer, e)}><SendIcon/></div>}
                            {customer.sending && <div onClick={e => this.onMessageSubmit(customer, e)}><SendingIcon/></div>}
                        </div>
                    </form>
                </Paper>
            </div>
        )
    }

    render() {
        // console.log("Chat props", this.props);
        return (
            <div style={{margin: "1%"}}>
                {this.props.isLoading ? <Loading/> : ""}
                <div style={{
                    display: "flex",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
                    flexWrap: "wrap",
                    gridTemplateRows: "auto",
                    gridGap: "20px", justifyContent: "start", alignContent: "start",
                }}>
                    {this.state.customers.map((customer, index) => this.renderSingleChat(customer))}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};

// const ChatsComponent = connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(_ChatsComponent);

export default _ChatsComponent;