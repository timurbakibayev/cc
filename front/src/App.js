import React, {Component} from 'react';
import './App.css';
import MainComponent from './components/Main.js';
import {HashRouter, Route, Switch} from 'react-router-dom';
import logo from './logo_almau.png';

class App extends Component {
    componentDidMount() {
        document.title = "Chat Center";
    }

    render() {
        return (
            <div className="App" style={{height: '100%'}}>
                <header className="App-header" style={{backgroundColor: "#be123d", height: "7vh"}}>
                    <h1 className="App-title" style={{color: "white"}}><img src={logo} style={{height: "1.5em"}}/> AlmaU University Chat-Center
                        </h1>
                </header>
                <HashRouter>
                    <Switch>
                        <Route render={(props) => (<MainComponent {...props}/>)}/>
                    </Switch>
                </HashRouter>

            </div>
        );
    }
}

export default App;
