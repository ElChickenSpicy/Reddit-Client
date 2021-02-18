import React from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { Posts } from '../Posts/Posts';
import { Comments } from '../Comments/Comments';

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = { posts: [] };
        this.fetchInitialData = this.fetchInitialData.bind(this);
      }
    
      async fetchInitialData() {
        //Fetch data from the r/popular page of Reddit
        const response = await fetch('https://www.reddit.com/r/popular.json');
        const jsonResponse = await response.json();
    
        //Store the first 10 posts in state
        const popularPosts = jsonResponse.data.children.slice(0, 10);
        this.setState({ posts: popularPosts })
        console.log(this.state.posts)
        this.state.posts.forEach(post => {
            console.log(post.data.post_hint)
        })
      }
    
      componentDidMount() {
        this.fetchInitialData();
      }

    render() {
        return (
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
                        <Route path="/" exact render={routeProps => <Posts rp={routeProps} initialPosts={this.state.posts}/>}/>
                        <Route path="/Comments" exact exact component={Comments} />
                    </Switch>
                </Router>
            </main>
        )
    }
};