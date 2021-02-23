import React from 'react';
import './App.css';
import { Navbar } from '../Navbar/Navbar';
import { Main } from '../Main/Main';
import { BrowserRouter as Router } from "react-router-dom";


export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      posts: [], 
      subreddit: 'popular',
      nav: ['popular', 'soccer', 'AskReddit', 'dataisbeautiful', 'ProgrammerHumor', 'Art']
     };
    this.fetchInitialData = this.fetchInitialData.bind(this);
    this.fetchSubredditData = this.fetchSubredditData.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.highlightActive = this.highlightActive.bind(this);
}

async fetchInitialData() {
    //Fetch data from the r/popular page of Reddit
    const response = await fetch('https://www.reddit.com/r/popular.json');
    const jsonResponse = await response.json();

    //Store the first 10 posts in state
    const popularPosts = jsonResponse.data.children.slice(0, 10);
    this.setState({ posts: popularPosts })
}

async fetchSubredditData(sub) {
    //Fetch data from the provided subreddit
    const response = await fetch('https://www.reddit.com/r/' + sub + '.json');
    const jsonResponse = await response.json();

    //Store the first 10 posts in state
    const subPosts = jsonResponse.data.children.slice(0, 10);
    this.setState({ posts: subPosts, subreddit: sub })

    document.querySelector('.top-container').scrollTo(0, 0);
}

highlightActive() {
  let selected = [];
  this.state.nav.forEach(item => {
    if (this.state.subreddit === item) {
      selected.push(item);
    }
  })
  return selected;
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
  this.highlightActive();
}

  render() {
    return (
      <div className="top-container">
        <Router>
          <Navbar navItems={this.state.nav} fetchSubredditData={this.fetchSubredditData} highlightActive={this.highlightActive()}/>
          <Main posts={this.state.posts} subreddit={this.state.subreddit} updatePost={this.updatePost} fetchSubredditData={this.fetchSubredditData}/>
        </Router>
      </div>
    )
  }
};

