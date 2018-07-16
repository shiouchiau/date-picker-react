import React, { Component } from 'react';
import Calendar from "./Calendar";
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Date Picker</h1>
        <Calendar />
      </div>
    );
  }
}

export default App;
