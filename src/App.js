import React, { Component } from 'react';
import Stage from './Stage';
import { videos } from './data';
import './App.css';

class App extends Component {
    render() {
        return <Stage items={videos} />;
    }
}

export default App;
