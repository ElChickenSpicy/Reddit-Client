import React from 'react';
import './App.css';
import { Navbar } from '../Navbar/Navbar';
import { Main } from '../Main/Main';
import { BrowserRouter as Router } from "react-router-dom";


export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { posts: [], subreddit: 'r/popular' };
    this.fetchInitialData = this.fetchInitialData.bind(this);
    this.fetchSubredditData = this.fetchSubredditData.bind(this);
    this.updatePost = this.updatePost.bind(this);
}

async fetchInitialData() {
    //Fetch data from the r/popular page of Reddit
    const response = await fetch('https://www.reddit.com/r/popular.json');
    const jsonResponse = await response.json();

    //Store the first 10 posts in state
    const popularPosts = jsonResponse.data.children.slice(0, 10);
    this.setState({ posts: popularPosts })
    console.log(popularPosts);
}

async fetchSubredditData(sub) {
    //Fetch data from the provided subreddit
    const response = await fetch('https://www.reddit.com/r/' + sub + '.json');
    const jsonResponse = await response.json();

    //Store the first 10 posts in state
    const subPosts = jsonResponse.data.children.slice(0, 10);
    this.setState({ posts: subPosts, subreddit: 'r/' + sub })
}

updatePost(post) {
    this.setState(prevState => ({
      posts: prevState.posts.map(
        el => el.data.id === post.data.id ? post : el
      )
    }))
}

componentDidMount() {
  this.fetchInitialData();
}

  render() {
    return (
      <div className="top-container">
        <Router>
          <Navbar fetchSubredditData={this.fetchSubredditData}/>
          <Main posts={this.state.posts} subreddit={this.state.subreddit} updatePost={this.updatePost}/>
        </Router>
      </div>
    )
  }
};

