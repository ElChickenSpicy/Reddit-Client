import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import './App.css';
import { Posts } from '../Posts/Posts';
import { Comments } from '../Comments/Comments';

export class App extends React.Component {
  render() {
    return (
      <div className="top-container">

        <nav>
          <input className="searchbar" placeholder="Search..."></input>
          <section className="subreddit-container">
            <header className="subreddit-title">Subreddits</header>

          </section>
        </nav>

        <main>
          <header className="main-header">
            {/* Desktop View */}
            <h2>Current Page</h2>
            <div id="brand">
              <img alt="icon" />
              <h1>Sean's Reddit App</h1>
            </div>

            {/* Mobile View */}
            <select>
              <option value="0">r/All</option>
              <option value="1">r/soccer</option>
              <option value="2">r/ProgrammerHumor</option>
              <option value="3">r/coolguides</option>
              <option value="4">r/dataisbeautiful</option>
              <option value="5">r/ABoringDystopia</option>
            </select>
            <input placeholder="Search..." />
          </header>

          <Router>
            <Switch>
              <Route path="/" exact component={Posts}/>
              <Route path="/Comments" exact exact component={Comments}/>
            </Switch>
          </Router>
        </main>

      </div>
    )
  }
};

