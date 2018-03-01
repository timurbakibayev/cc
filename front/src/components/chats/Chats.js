import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
//https://github.com/brandonmowat/react-chat-ui:
import {ChatFeed, Message} from 'react-chat-ui'
import Typography from 'material-ui/Typography';

import Paper from 'material-ui/Paper';

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

class _ChatsComponent extends Component {

    constructor(e) {
        super(e);
        this.messagesRef = {};
        this.state = {
            editField: {},
            clients: [
                {
                    id: 10,
                    name: "Timur Bakibayev",
                    messages: [
                        new Message({
                            id: 1,
                            message: "I'm the recipient! (The person you're talking to)",
                        }), // Gray bubble
                        new Message({id: 0, message: "I'm you -- the blue bubble!"}), // Blue bubble
                    ],
                    is_typing: false,
                    expanded: true,
                    order: 1,
                    reply: "",
                    ref: null,
                },
                {
                    id: 12,
                    name: "Kuanysh Abeshev",
                    messages: [
                        new Message({
                            id: 1,
                            message: "I'm the recipient! (The person you're talking to)",
                        }), // Gray bubble
                        new Message({id: 0, message: "I'm you -- the blue bubble!"}), // Blue bubble
                        new Message({id: 0, message: "I'm you -- the blue bubble!"}), // Blue bubble
                        new Message({id: 0, message: "I'm you -- the blue bubble!"}), // Blue bubble
                        new Message({id: 0, message: "I'm you -- the blue bubble!"}), // Blue bubble
                        new Message({id: 0, message: "I'm you -- the blue bubble!"}), // Blue bubble
                        new Message({id: 1, message: "I'm you -- the blue bubble!"}), // Blue bubble
                        new Message({id: 0, message: "I'm you -- the blue bubble!"}), // Blue bubble
                        new Message({id: 1, message: "I'm you -- the blue bubble!"}), // Blue bubble
                        new Message({id: 0, message: "I'm you -- the blue bubble!"}), // Blue bubble
                    ],
                    is_typing: false,
                    expanded: true,
                    order: 3,
                    reply: "Привет, Куаныш!",
                    ref: null,
                },
                {
                    id: 130,
                    name: "Zhanna Malikova",
                    messages: [
                        new Message({
                            id: 1,
                            message: "I'm the recipient! (The person you're talking to)",
                        }), // Gray bubble
                        new Message({id: 0, message: "I'm you -- the blue bubble!"}), // Blue bubble
                    ],
                    is_typing: false,
                    expanded: true,
                    order: 2,
                    reply: "Привет, Жанна!",
                    ref: null,
                },
            ].sort( (i,j) => i.order < j.order? -1: 1),
        }
    }

    componentWillMount() {
        this.setState({mounted: true});
        console.log("Chat Component Will Mount", this.props);
    }

    componentDidMount() {
        this.state.clients.forEach((client) => {
            try {
                const objDiv = findDOMNode(this).querySelector('.chat'+client.id);
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

    onMessageSubmit(client, e) {
        e.preventDefault();
        console.log("New message push client ", client.name + ": " + client.reply);

        client.messages.push(
            new Message({id: 0, message: client.reply}),
        );
        client.reply = "";
        this.setState({clients: [
            ...this.state.clients.filter((c)=>c.id !== client.id),
            client]
            .sort( (i,j) => i.order < j.order? -1: 1)});
        try {
            const objDiv = findDOMNode(this).querySelector('.chat'+client.id);
            objDiv.scrollTop = 100000;
        } catch (e) {
            console.log(e);
        }
    }

    renderSingleChat(client) {
        var h17 = client.expanded?"17em":"auto";
        var h15 = client.expanded?"15em":"auto";

        return (
            <div key={client.id} style={{display: "flex", flexFlow: "column"}}>
                <Paper elevation={10} style={{width: "300px", maxWidth: "300px", margin: "10px", height: h17}}>
                    <Typography onClick={()=>{
                        client.expanded = !client.expanded;
                        this.setState({clients: [...this.state.clients.filter((c)=>c.id !== client.id), client].sort( (i,j) => i.order < j.order? -1: 1)});
                        const el = this;
                        setTimeout(function () {
                            el.setState({clients: [...el.state.clients.filter((c)=>c.id !== client.id)].sort( (i,j) => i.order < j.order? -1: 1)});
                        }, 700);

                    }} className="cardExpandableHeader" align="center"
                                type="headline" component="h3" style={{height: "2em"}}>
                        <span style={{fontSize: "1.6em", fontWeight: "bold"}}>{client.name}</span>
                    </Typography>
                    <Collapse style={{overflowY: 'auto', overflowX: 'auto', height: h15}}
                              in={client.expanded}
                              unmountOnExit
                              className={"chat"+client.id}
                    >
                        <div style={{display: "flex", height: h15, flexFlow: "column"}}>
                            <div style={{zoom: 0.7, margin: 5, marginBottom: "1.5em"}}>
                                <ChatFeed
                                    messages={client.messages}
                                    isTyping={client.is_typing}
                                    hasInputField={false}
                                    showSenderName
                                    bubblesCentered={false}
                                />
                            </div>
                        </div>
                    </Collapse>
                </Paper>
                <Paper key={10000+client.id} elevation={10} style={{width: "300px", marginTop: -10, marginLeft: 10, height: "2em"}}>
                    <form onSubmit={e => this.onMessageSubmit(client, e)}>
                        <input
                            style={{width: "95%", border: 0, fontSize: "1em", outline: "none"}}
                            placeholder="Введите сообщение..."
                            className="message-input"
                            value = {client.reply}
                            onChange={(e)=>{
                                client.reply = e.target.value;
                                this.setState({clients: [...this.state.clients.filter((c)=>c.id !== client.id), client].sort( (i,j) => i.order < j.order? -1: 1)});
                            }}

                        />
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
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px,1fr));",
                    flexWrap: "wrap",
                    gridTemplateRows: "auto",
                    gridGap: "20px", justifyContent: "start", alignContent: "start",
                }}>
                    {this.state.clients.map((client, index) => this.renderSingleChat(client))}
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