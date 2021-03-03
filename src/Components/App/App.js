import React from 'react';
import './App.css';
import { Navbar } from '../Navbar/Navbar';
import { Main } from '../Main/Main';
import { Options } from '../Options/Options';
import { BrowserRouter as Router } from "react-router-dom";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      posts: [], 
      activeSubreddit: 'popular',
      nav: ['popular', 'soccer', 'AskReddit', 'dataisbeautiful', 'ProgrammerHumor', 'Art'],
      subredditsAbout: []
     };
    this.fetchInitialData = this.fetchInitialData.bind(this);
    this.fetchAbout = this.fetchAbout.bind(this);
    this.fetchSubredditData = this.fetchSubredditData.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.highlightActive = this.highlightActive.bind(this);
    this.addSubreddit = this.addSubreddit.bind(this);
    this.removeSubreddit = this.removeSubreddit.bind(this);
    this.Search = this.Search.bind(this);
}

async fetchInitialData() {
  //Fetch data from the r/popular page of Reddit
  const response = await fetch('https://www.reddit.com/r/popular.json');
  if (response.ok) {
    const jsonResponse = await response.json();

    //Store the first 10 posts in state
    const popularPosts = jsonResponse.data.children.slice(0, 10);
    this.setState({ posts: popularPosts });

    //Populate the subredditsAbout state with the subreddit data from the initial posts
    this.state.posts.forEach(({ data: { subreddit } }) => {
      this.fetchAbout(subreddit);
    });
  }
}

//Return the About data of the given subreddit
//Allows state to dynamically assign subreddit icons and descriptions to the corresponding posts
async fetchAbout(post) {
  const response = await fetch('https://www.reddit.com/r/' + post + '/about/.json');
  if (response.ok) {
    const jsonResponse = await response.json();
    const subreddit = jsonResponse.data;

    //If the array is empty, add the first element
    if (this.state.subredditsAbout.length <= 0) {
      this.setState({ subredditsAbout: [subreddit] });

    //Else, check if the subreddit exists in state
    } else {
      const copy = this.state.subredditsAbout;
      let exists = copy.filter(({ name }) => {
        return name === subreddit.name;
      });

      //If it doesn't exist, add it to state
      if (exists.length === 0) {
        this.setState({
          subredditsAbout: [...copy, subreddit]
        });
      }
    }
  }
}

async fetchSubredditData(sub) {
  //Fetch data from the provided subreddit
  const response = await fetch('https://www.reddit.com/r/' + sub + '.json');
  if (response.ok) {
    const jsonResponse = await response.json();

    //Store the first 10 posts in state
    const subPosts = jsonResponse.data.children.slice(0, 10);
    this.setState({ posts: subPosts, activeSubreddit: sub });

    //Fetch the subredditsAbout data
    this.state.posts.forEach(({ data: { subreddit, subreddit_id }}) => {
      let exists = this.state.subredditsAbout.filter(({ name }) => {
        return name === subreddit_id;
      });
      if (exists.length === 0) {
        this.fetchAbout(subreddit);
      }
    });
  
    document.querySelector('.top-container').scrollTo(0, 0);
  }
}

async Search(query, str) {
  //Fetch data from the provided subreddit
  const response = await fetch(query);
  if (response.ok) {
    const jsonResponse = await response.json();

    //Store the first 10 posts in state
    const subPosts = jsonResponse.data.children.slice(0, 10);
    this.setState({ posts: subPosts, activeSubreddit: "Search Results: " + str });

    //Fetch the subredditsAbout data
    this.state.posts.forEach(({ data: { subreddit, subreddit_id }}) => {
      let exists = this.state.subredditsAbout.filter(({ name }) => {
        return name === subreddit_id;
      });
      if (exists.length === 0) {
        this.fetchAbout(subreddit);
      }
    });
  
    document.querySelector('.top-container').scrollTo(0, 0);
  }
}

highlightActive() {
  let selected = [];
  this.state.nav.forEach(item => {
    if (this.state.activeSubreddit === item) {
      selected.push(item);
    }
  })
  return selected;
}

addSubreddit(sub) {
  let newNav = this.state.nav;
  newNav.push(sub);
  this.setState({ nav: newNav });
}

removeSubreddit(sub) {
  let newNav = this.state.nav;
  newNav = newNav.filter(nav => nav !== sub);
  this.setState({ nav: newNav });
}

updatePost(post) {
  this.setState(prevState => ({
    posts: prevState.posts.map(
      el => el.data.id === post.data.id ? post : el
    )
  }));
}

componentDidMount() {
  this.fetchInitialData();
  this.highlightActive();
}

  render() {
    return (
      <div className="top-container">
        <Router>
          <Navbar 
            navItems={this.state.nav} 
            fetchSubredditData={this.fetchSubredditData} 
            highlightActive={this.highlightActive()}
            search={this.Search}
            fetchAbout={this.fetchAbout}
          />
          <Main 
            posts={this.state.posts} 
            navItems={this.state.nav} 
            updatePost={this.updatePost} 
            fetchSubredditData={this.fetchSubredditData}
            addSubreddit={this.addSubreddit}
            removeSubreddit={this.removeSubreddit}
            fetchAbout={this.fetchAbout}
            about={this.state.subredditsAbout}
          />
          <Options />
        </Router>
      </div>
    )
  }
};

