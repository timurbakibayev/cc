import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
//https://github.com/brandonmowat/react-chat-ui:
import {ChatFeed, Message} from 'react-chat-ui'
import Typography from 'material-ui/Typography';
import Menu, {MenuItem} from 'material-ui/Menu';
import Paper from 'material-ui/Paper';

import SendIcon from 'material-ui-icons/Send';
import SendingIcon from 'material-ui-icons/CloudCircle';
import TelegramIcon from '../Telegram_Messenger.png';

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

const sorted = (customers) =>
    customers.sort((i,j) =>
        i.unread < j.unread? 1 : i.unread > j.unread? -1 : (i.order < j.order ? -1 : 1)
    );

class _ChatsComponent extends Component {

    constructor(e) {
        super(e);
        this.messagesRef = {};
        this.state = {
            editField: {},
            customers: [],
            selected: -1,
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
            const result = sorted(JSON.parse(text));
            console.log("Got:",result);
            let customers = this.state.customers;
            result.forEach((customer) => {
                customer.expanded = true;
                customer.sending = false;
                let messageObjects = [];
                customer.messages.forEach((message) => {
                    messageObjects.push(message);
                });
                customer.messages = messageObjects;
                if (customers.filter((c) => c.id === customer.id).length === 0) {
                    customers.push(customer);
                    customers = sorted(customers);
                    this.setState({customers: customers});
                    setTimeout(
                        () => {
                            try {
                                const objDiv = findDOMNode(this).querySelector('.chat' + customer.id);
                                objDiv.scrollTop = 100000;
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        , 200)
                } else {
                    let the_customer = customers.filter((c) => c.id === customer.id)[0];
                    the_customer.order = customer.order;
                    the_customer.unread = customer.unread;
                    the_customer.name = customer.name;
                    if (the_customer.messages.length !== customer.messages.length) {
                        the_customer.messages = customer.messages;
                        this.setState({
                            customers: sorted([
                                ...this.state.customers.filter((c) => c.id !== the_customer.id),
                                the_customer])
                        });
                        setTimeout(
                            () => {
                                try {
                                    const objDiv = findDOMNode(this).querySelector('.chat' + customer.id);
                                    objDiv.scrollTop = 100000;
                                } catch (e) {
                                    console.log(e);
                                }
                                try {
                                    const objDiv1 = findDOMNode(this).querySelector('.global_chat');
                                    objDiv1.scrollTop = 100000;
                                } catch (e) {
                                    console.log(e);
                                }
                            }
                            , 200)
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
            customers: sorted([
                ...this.state.customers.filter((c) => c.id !== customer.id),
                customer])
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

            // customer.messages.push(
            //     new Message({id: 0, message: customer.reply}),
            // );
            customer.sending = false;
            customer.reply = "";
            customer.unread = 0;
            this.setState({
                customers: sorted([
                    ...this.state.customers.filter((c) => c.id !== customer.id),
                    customer])
            });
            try {
                const objDiv = findDOMNode(this).querySelector('.chat' + customer.id);
                objDiv.scrollTop = 100000;
                const objC = findDOMNode(this).querySelector('.global_chat');
                objC.scrollTop = 100000;
            } catch (e) {
                console.log(e);
            }
        } else {
            alert("We've got problem: " + response.status);
            customer.sending = false;
            this.setState({
                customers: sorted([
                    ...this.state.customers.filter((c) => c.id !== customer.id),
                    customer])
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
                        //customer.expanded = !customer.expanded;
                        this.setState({selected: customer.id});
                        setTimeout(() => {
                            try {
                                const objDiv = findDOMNode(this).querySelector('.global_chat');
                                objDiv.scrollTop = 100000;
                            } catch (e) {
                                console.log(e);
                            }
                        }, 200)
                    }}

                                className="cardExpandableHeader" align="center"
                                type="headline" component="h3" style={{height: "2em"}}>
                        <span style={{fontSize: "1.6em", fontWeight: "bold", color: "white"}}>{customer.name}</span>
                    </Typography>
                    <Collapse style={{overflowY: 'auto', overflowX: 'auto', height: h15}}
                              in={customer.expanded}
                              unmountOnExit
                              className={"chat" + customer.id}
                    >

                        <div style={{display: "flex", height: h15, flexFlow: "column"}}>
                            <div style={{zoom: 0.7, margin: 5, marginBottom: "1.5em"}}>
                                <div style={{display: "flex", flexFlow: "column", width: "100%"}}>
                                    {customer.messages.map((message) => (
                                        <div key={message.id} style={{display:"block", flexFlow:"column",
                                            color: "white",
                                            maxWidth: "425px",
                                            padding: "8px 14px",
                                            float: message.reply === 1?"right":"left",
                                            marginLeft: message.reply === 1?"30%":"",
                                            marginRight: message.reply === 1?"":"30%",
                                        }}>
                                            <div style={{display: "flex",
                                                backgroundColor: message.reply === 1?"rgb(0, 132, 255)":"rgb(132,132,200)",
                                                borderRadius: "10px",
                                                padding: "10px"
                                            }}>{ message.message }</div>
                                            <div style={{color: "gray", fontSize: "12px", float: message.reply === 1?"right":"left",}}>{ message.time }</div>
                                        </div>
                                        )
                                    )}
                                </div>
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
                                        this.setState({customers: sorted([...this.state.customers.filter((c) => c.id !== customer.id), customer])});
                                    }}
                                />
                            </div>
                            {!customer.sending &&
                            <div onClick={e => this.onMessageSubmit(customer, e)}><SendIcon/></div>}
                            {customer.sending &&
                            <div onClick={e => this.onMessageSubmit(customer, e)}><SendingIcon/></div>}
                        </div>
                    </form>
                </Paper>
            </div>
        )
    }


    renderGlobalChat(customer) {
        var h17 = customer.expanded ? "17em" : "auto";
        var h15 = customer.expanded ? "15em" : "auto";
        return (
            <div key={customer.id} style={{display: "flex", width: "98%", flexFlow: "column", height: "80vh"}}>
                <Paper elevation={10} style={{width: "100%", maxWidth: "100%", margin: "1%", flex: 0.9}}>
                    <Typography onClick={() => {
                        this.setState({selected: -1});
                        setTimeout(() => {
                            this.state.customers.forEach((c) => {
                                try {
                                    const objDiv = findDOMNode(this).querySelector('.chat' + c.id);
                                    objDiv.scrollTop = 100000;
                                } catch (e) {
                                    console.log(e);
                                }
                            })
                            }, 200);
                    }} className="cardExpandableHeader" align="center"
                                type="headline" component="h3" style={{height: "2em"}}>
                        <span style={{fontSize: "1.6em", fontWeight: "bold", color: "white"}}>{customer.name}</span>
                    </Typography>
                    <Collapse style={{overflowY: 'auto', overflowX: 'auto', height: "70vh"}}
                              in={customer.expanded}
                              unmountOnExit
                              className={"global_chat"}
                    >
                        <div style={{display: "flex", height: "100%", flexFlow: "column"}}>
                            <div style={{margin: 5, marginBottom: "1.5em"}}>
                                <div style={{display: "flex", flexFlow: "column", width: "100%"}}>
                                    {customer.messages.map((message) => (
                                            <div key={message.id} style={{display:"block", flexFlow:"column",
                                                color: "white",
                                                padding: "8px 14px",
                                                float: message.reply === 1?"right":"left",
                                                marginLeft: message.reply === 1?"30%":"",
                                                marginRight: message.reply === 1?"":"30%",
                                            }}>
                                                <div style={{display: "flex",
                                                    backgroundColor: message.reply === 1?"rgb(0, 132, 255)":"rgb(132,132,200)",
                                                    borderRadius: "10px",
                                                    padding: "10px"
                                                }}>{ message.message }</div>
                                                <div style={{color: "gray", fontSize: "12px", float: message.reply === 1?"right":"left",}}>{ message.time }</div>
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </Collapse>
                </Paper>

                <Paper key={10000 + customer.id} elevation={10}
                       style={{width: "100%", marginTop: -10, marginLeft: 10, flex: 0.1}}>
                    <form onSubmit={e => this.onMessageSubmit(customer, e)}>
                        <div style={{display: "flex", flexFlow: "row"}}>
                            <div style={{flex: 1}}>
                                <input
                                    style={{width: "95%", border: 0, fontSize: "1.5em", outline: "none"}}
                                    placeholder="Введите сообщение..."
                                    className="message-input"
                                    value={customer.reply}
                                    onChange={(e) => {
                                        customer.reply = e.target.value;
                                        this.setState({customers: sorted([...this.state.customers.filter((c) => c.id !== customer.id), customer])});
                                    }}
                                />
                            </div>
                            {!customer.sending &&
                            <div onClick={e => this.onMessageSubmit(customer, e)}><SendIcon/></div>}
                            {customer.sending &&
                            <div onClick={e => this.onMessageSubmit(customer, e)}><SendingIcon/></div>}
                        </div>
                    </form>
                </Paper>
            </div>
        )
    }

    renderSingleCustomer(customer) {
        return (
            <MenuItem key={7000 + customer.id}
                      onClick={
                () => {
                    //this.setState({openR: false});
                    this.setState({selected: this.state.selected === customer.id?-1:customer.id});
                    setTimeout(
                        () => {
                            this.state.customers.forEach((c) => {
                                try {
                                    const objDiv = findDOMNode(this).querySelector('.chat'+c.id);
                                    objDiv.scrollTop = 100000;
                                } catch (e) {
                                    console.log(e);
                                }
                            });
                            try {
                                const objDiv = findDOMNode(this).querySelector('.global_chat');
                                objDiv.scrollTop = 100000;
                            } catch (e) {
                                console.log(e);
                            }
                        }
                        , 200)
                }}> <span style={{color: "white"}}> <img src={TelegramIcon} height={"15"} style={{visibility: customer.unread === 0?"hidden":"visible"}}/> {customer.name} <b>{customer.unread === 0?"":customer.unread}</b></span>
            </MenuItem>
        )
    }

    render() {
        // console.log("Chat props", this.props);
        return (
            <div style={{height: "85vh"}}>
                <div style={{display: "flex", flexFlow: "row", height: "100%"}}>
                    {this.props.isLoading ? <Loading/> : ""}
                    <div style={{
                        flex: 0.15,
                        backgroundColor: "rgb(211, 61, 86)",
                        color: "white",
                        height: "100%",
                        overflow: "auto"
                    }}>
                        <div>
                            {this.state.customers.map((customer, index) => this.renderSingleCustomer(customer))}
                        </div>
                    </div>
                    {this.state.selected === -1 && <div style={{
                        overflow: "auto",
                        margin: "1%",
                        display: "flex",
                        height: "100%",
                        flex: 0.85,
                        gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr))",
                        flexWrap: "wrap",
                        gridTemplateRows: "auto",
                        gridGap: "20px", justifyContent: "start", alignContent: "start",
                    }}>
                        {this.state.customers.map((customer, index) => this.renderSingleChat(customer))}
                    </div>}
                    {this.state.selected > -1 && <div style={{
                        margin: "1%",
                        display: "flex",
                        flex: 0.85,
                    }}>
                        {this.state.customers.filter((c)=>c.id === this.state.selected)
                            .map((customer, index) => this.renderGlobalChat(customer))}
                    </div>}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {};


// const ChatsComponent=connect(
//     mapStateToProps,
//     mapDispatchToProps
// )(_ChatsComponent);

export default _ChatsComponent;