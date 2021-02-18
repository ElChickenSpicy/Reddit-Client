import React from 'react';
import './App.css';
import { Navbar } from '../Navbar/Navbar';
import { Main } from '../Main/Main';

export class App extends React.Component {
  render() {
    return (
      <div className="top-container">
        <Navbar />
        <Main />
      </div>
    )
  }
};

