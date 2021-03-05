import React from 'react';
import './App.css';
import { Navbar } from '../Navbar/Navbar';
import { Main } from '../Main/Main';
import { Options } from '../Options/Options';
import { BrowserRouter as Router } from "react-router-dom";
import { decode } from 'html-entities';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      activeSubreddit: 'popular',
      nav: ['soccer', 'AskReddit', 'dataisbeautiful', 'ProgrammerHumor', 'Art'],
      subredditsAbout: [],
      view: 'hot',
      scrollPosition: []
    };
    this.fetchInitialData = this.fetchInitialData.bind(this);
    this.fetchNavSubs = this.fetchNavSubs.bind(this);
    this.fetchAbout = this.fetchAbout.bind(this);
    this.fetchSubredditData = this.fetchSubredditData.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.highlightActive = this.highlightActive.bind(this);
    this.addSubreddit = this.addSubreddit.bind(this);
    this.removeSubreddit = this.removeSubreddit.bind(this);
    this.Search = this.Search.bind(this);
    this.getSubreddit = this.getSubreddit.bind(this);
    this.changeView = this.changeView.bind(this);
    this.saveScrollPosition = this.saveScrollPosition.bind(this);
    this.setScrollPosition = this.setScrollPosition.bind(this);
    this.submit = this.submit.bind(this);
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

  fetchNavSubs(arr) {
    arr.forEach(async sub => {
      let exists = this.state.subredditsAbout.filter(el => el.display_name === sub);
      if (exists.length === 0) {
        const response = await fetch(`https://www.reddit.com/r/${sub}/about/.json`);
        if (response.ok) {
          const jsonResponse = await response.json();
          const subreddit = jsonResponse.data;

          this.setState({ subredditsAbout: [...this.state.subredditsAbout, subreddit] });
        }
      }
    });
  }

  //Return the About data of the given subreddit
  //Allows state to dynamically assign subreddit icons and descriptions to the corresponding posts
  async fetchAbout(post) {
    const response = await fetch(`https://www.reddit.com/r/${post}/about/.json`);
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
          this.setState({ subredditsAbout: [...copy, subreddit] });
        }
      }
    }
  }

  async fetchSubredditData(sub) {
    //Fetch data from the provided subreddit
    const response = await fetch(`https://www.reddit.com/r/${sub}.json`);
    if (response.ok) {
      const jsonResponse = await response.json();

      //Store the first 10 posts in state
      const subPosts = jsonResponse.data.children.slice(0, 10);
      this.setState({ posts: subPosts, activeSubreddit: sub, view: 'hot' });

      //Fetch the subredditsAbout data
      this.state.posts.forEach(({ data: { subreddit, subreddit_id } }) => {
        let exists = this.state.subredditsAbout.filter(({ name }) => {
          return name === subreddit_id;
        });
        if (exists.length === 0) {
          this.fetchAbout(subreddit);
        }
      });

      window.scrollTo(0, 0);
    }
  }

  async changeView(sub, view, query = '') {
    //Fetch data from the provided subreddit
    const response = await fetch(`https://www.reddit.com/r/${sub}/${view}/.json${query}`);
    if (response.ok) {
      const jsonResponse = await response.json();

      //Store the first 10 posts in state
      const subPosts = jsonResponse.data.children.slice(0, 10);
      this.setState({ posts: subPosts, activeSubreddit: sub, view: view });

      //Fetch the subredditsAbout data
      this.state.posts.forEach(({ data: { subreddit, subreddit_id } }) => {
        let exists = this.state.subredditsAbout.filter(({ name }) => {
          return name === subreddit_id;
        });
        if (exists.length === 0) {
          this.fetchAbout(subreddit);
        }
      });

      window.scrollTo(0, 0);
    }
  }

  async Search(query, str) {
    //Fetch data from the provided subreddit
    const response = await fetch(query);
    if (response.ok) {
      const jsonResponse = await response.json();

      //Store the first 10 posts in state
      const subPosts = jsonResponse.data.children.slice(0, 10);
      this.setState({ posts: subPosts, activeSubreddit: `Search Results: ${str}`, view: 'hot' });

      //Fetch the subredditsAbout data
      this.state.posts.forEach(({ data: { subreddit, subreddit_id } }) => {
        let exists = this.state.subredditsAbout.filter(({ name }) => {
          return name === subreddit_id;
        });
        if (exists.length === 0) {
          this.fetchAbout(subreddit);
        }
      });

      window.scrollTo(0, 0);
    }
  }

  //Alert the user that if they search r/popular by NEW, they may come across NSFW content
  submit() {
    confirmAlert({
      title: 'Please Note:',
      message: 'Filtering r/popular by NEW can occasionally return Not Safe For Work (NSFW) content.',
      buttons: [
        {
          label: 'Continue',
          onClick: () => this.changeView(this.state.activeSubreddit, 'new')
        },
        {
          label: 'Cancel',
        }
      ]
    });
  }

  getSubreddit(name) {
    //Resusable JSX element
    const view =           
      <div className="change-view">
      <div
        className="change hot"
        title="View the Hottest posts"
        onClick={() => this.changeView(this.state.activeSubreddit, 'hot')}>
        <i className="fas fa-fire-alt"
          style={this.state.view == "hot" ? { color: 'lightcoral' } : { color: 'white' }}>
          <span>Hot</span>
        </i>
      </div>
      <div
        className="change top"
        title="View the Top posts of all time"
        onClick={() => this.changeView(this.state.activeSubreddit, 'top', '?t=all')}>
        <i className="fas fa-medal"
          style={this.state.view == "top" ? { color: 'lightgreen' } : { color: 'white' }}>
          <span>Top</span>
        </i>
      </div>
      <div
        className="change new"
        title="View the Newest posts"
        onClick={() => {
          name === 'popular' ? this.submit() : this.changeView(this.state.activeSubreddit, 'new')
        }}>
        <i className="fas fa-certificate"
          style={this.state.view == "new" ? { color: 'lightskyblue' } : { color: 'white' }}>
          <span>New</span>
        </i>
      </div>
    </div>
    if (name === 'popular') {
      return (
        <section className="current-view">
          <div className="active-subreddit">
            <h3>Current Subreddit</h3>
            <h1>r/All</h1>
            <p>This is Reddit's Homepage, where you can see the most popular posts across a wide range of subreddits.</p>
          </div>
          {view}
        </section>        
      );
    } else if (name.startsWith('Search Results: ')) {
      return (
        <section className="current-view">
          <div className="active-subreddit">
            <h3>You Searched For...</h3>
            <h1>{name.split(":")[1]}</h1>
            <p>Using this search function, you search all of Reddit to find posts that best fit your search query. If you want to search for specific subreddits, the searchbar below will do the trick!</p>
          </div>
        </section>
      );
    } else {
      //Get the data of the active subreddit and destructure the necessary variables
      const active = this.state.subredditsAbout.filter(el => name === el.display_name);
      const { accounts_active, display_name, public_description, subscribers } = active[0];
      //Is the subreddit included in the Navbar?
      let included = this.state.nav.includes(display_name);
      return (
        <section className="current-view">
          <div className="active-subreddit">
            <h3>Current Subreddit</h3>
            <div className="add-remove">
              {included === true ? 
                <i className="far fa-minus-square" title="Remove this subreddit from your Navigation Bar" style={{order: '1'}} onClick={() => this.removeSubreddit(display_name)}></i> : 
                <i className="far fa-plus-square" title="Add this subreddit to your Navigation Bar" style={{order: '1'}} onClick={() => this.addSubreddit(display_name)}></i>
              }
              <h1>r/{display_name}</h1>
            </div>
            <p>{decode(public_description)}</p>
            <h4><span className="subscribers">{subscribers.toLocaleString()}</span> Subscibers</h4>
            <h4><span className="accounts">{accounts_active.toLocaleString()}</span> Active Users</h4>
          </div>
          {view}
        </section>
      );
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

  saveScrollPosition() {
    this.setState({ scrollPosition: [window.scrollX, window.scrollY] });
  }

  setScrollPosition() {
    window.scrollTo(...this.state.scrollPosition);
  }

  componentDidMount() {
    this.fetchInitialData();
    this.fetchNavSubs(this.state.nav);
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
            subredditsAbout={this.state.subredditsAbout}
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
            setScrollPosition={this.setScrollPosition}
            saveScrollPosition={this.saveScrollPosition}
          />
          <Options
            activeSubreddit={this.state.activeSubreddit}
            getSubreddit={this.getSubreddit}
          />
        </Router>
      </div>
    )
  }
};

