import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
//https://github.com/brandonmowat/react-chat-ui:
import {ChatFeed, Message} from 'react-chat-ui'
import Typography from 'material-ui/Typography';

import Paper from 'material-ui/Paper';

import SendIcon from 'material-ui-icons/Message';

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
            customers: [
                {
                    id: 10,
                    name: "Загрузка...",
                    messages: [
                        new Message({
                            id: 1,
                            message: "Сообщения загружаются",
                        }), // Gray bubble
                        new Message({id: 0, message: "ОК, я жду..."}), // Blue bubble
                    ],
                    is_typing: false,
                    expanded: true,
                    order: 1,
                    reply: "",
                    ref: null,
                },
            ].sort((i, j) => i.order < j.order ? -1 : 1),
        }
    }

    componentWillMount() {
        this.setState({mounted: true});
        console.log("Chat Component Will Mount", this.props);
    }

    async refreshMessages() {
        console.log("Requesting from " + url_messages + "...");
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
            const customers = JSON.parse(text).sort((i, j) => i.order < j.order ? -1 : 1);
            customers.forEach((customer) => {
                customer.expanded = true;
                customer.sending = false;
                var messageObjects = [];
                customer.messages.forEach((message) => {
                    messageObjects.push(new Message(message));
                });
                customer.messages = messageObjects;
            });

            this.setState({customers: customers});
            console.log("messages", customers);
        }
    }

    componentDidMount() {
        this.refreshMessages();
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
                            <div onClick={e => this.onMessageSubmit(customer, e)}><SendIcon/></div>
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