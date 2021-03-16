import React from 'react';
import './App.css';
import { Link } from "react-router-dom";
import { Navbar } from '../Navbar/Navbar';
import { Main } from '../Main/Main';
import { Options } from '../Options/Options';
import { decode } from 'html-entities';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      activeSubreddit: 'popular',
      nav: [ 'soccer', 'AskReddit', 'dataisbeautiful', 'ProgrammerHumor', 'Art' ],
      top: [],
      searchTerm: '',
      subredditsAbout: [],
      view: 'hot',
      scrollPosition: []
    };
    this.addSubreddit = this.addSubreddit.bind(this);
    this.checkData = this.checkData.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.fetchAbout = this.fetchAbout.bind(this);
    this.fetchInitialData = this.fetchInitialData.bind(this);
    this.fetchNavSubs = this.fetchNavSubs.bind(this);
    this.fetchPosts = this.fetchPosts.bind(this);
    this.fetchTop = this.fetchTop.bind(this);
    this.getSubreddit = this.getSubreddit.bind(this);
    this.highlightActive = this.highlightActive.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
    this.removeSubreddit = this.removeSubreddit.bind(this);
    this.saveScrollPosition = this.saveScrollPosition.bind(this);
    this.searchSubs = this.searchSubs.bind(this);
    this.setScrollPosition = this.setScrollPosition.bind(this);
    this.submit = this.submit.bind(this);
    this.updatePost = this.updatePost.bind(this);
  }

  async makeRequest(query) {
    try {
      const response = await fetch(`https://www.reddit.com/${query}`);
      if (response.ok) {
        const jsonResponse = await response.json();
        return jsonResponse;
      }
    } catch(err) {
      alert(err);
    }
  }

  //Fetch the initial set of posts
  async fetchInitialData() {
    const jsonResponse = await this.makeRequest('r/popular.json');
    const popularPosts = jsonResponse.data.children.slice(0, 10);
    this.setState({ posts: popularPosts });

    this.state.posts.forEach(({ data: { subreddit } }) => {
      this.fetchAbout(subreddit);
    });
  }

  //Fecth the subreddit data of each sub in Nav
  fetchNavSubs(arr) {
    arr.forEach(async sub => {
      //If already captured, don't make request
      let exists = this.state.subredditsAbout.filter(el => el.display_name === sub);
      if (exists.length === 0) {
        const jsonResponse = await this.makeRequest(`r/${sub}/about/.json`);
        const subreddit = jsonResponse.data;
        this.setState({ subredditsAbout: [...this.state.subredditsAbout, subreddit] }); 
      }
    });
  }

  //Return the about data of the given subreddit
  async fetchAbout(post) {
    const jsonResponse = await this.makeRequest(`r/${post}/about/.json`);
    const subreddit = jsonResponse.data;

    //Add element if empty, otherwise check if it exists
    if (this.state.subredditsAbout.length <= 0) {
      this.setState({ subredditsAbout: [subreddit] });
    } else {
      const copy = this.state.subredditsAbout;
      let exists = copy.filter(({ name }) => {
        return name === subreddit.name;
      });
      if (exists.length === 0) {
        this.setState({ subredditsAbout: [...copy, subreddit] });
      }
    }
  }

  //Fetch the top 10 subreddits
  async fetchTop() {
    const jsonResponse = await this.makeRequest('subreddits/.json');
    let topSubs = jsonResponse.data.children.slice(0, 11);

    //Remove the 1st element, as it is r/Home (bug on Reddit's side)
    topSubs.shift();
    this.setState({ top: topSubs, searchTerm: 'Top Subreddits' });
  }

  //Search subreddits with a query
  async searchSubs(query, str) {
    const jsonResponse = await this.makeRequest(query);
    const searchPosts = jsonResponse.data.children.slice(0, 8);
    this.setState({ top: searchPosts, searchTerm: `${str}...` });
  }

  //Fetch Reddit posts
  async fetchPosts(query, active, view = 'hot', sort = '') {
    const jsonResponse = await this.makeRequest(query);
    const subPosts = jsonResponse.data.children.slice(0, 10);
    this.setState({ posts: subPosts, activeSubreddit: active, view: view });
    this.checkData();
  }

  checkData() {
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

  //Alert if search r/all by new
  submit() {
    confirmAlert({
      title: 'Please Note:',
      message: 'Filtering r/popular by NEW can occasionally return Not Safe For Work (NSFW) content.',
      buttons: [
        {
          label: 'Continue',
          onClick: () => this.fetchPosts(`r/${this.state.activeSubreddit}/new/.json`, this.state.activeSubreddit, 'new')
        },
        {
          label: 'Cancel',
        }
      ]
    });
  }

  //Data and JSX for the Top right menu (current position view)
  getSubreddit(name) {
    //Resusable JSX element
    const view =
      <div className="change-view">
        <Link to="/">
          <div
            className="change hot"
            title="View the Hottest posts"
            onClick={() => this.fetchPosts(`r/${this.state.activeSubreddit}/hot/.json`, this.state.activeSubreddit, 'hot')}>
            <i className="fas fa-fire-alt"
              style={this.state.view === "hot" ? { color: 'lightcoral' } : { color: 'white' }}>
              <span>Hot</span>
            </i>
          </div>
        </Link>
        <Link to="/">
          <div
            className="change top"
            title="View the Top posts of all time"
            onClick={() => this.fetchPosts(`r/${this.state.activeSubreddit}/top/.json?t=all`, this.state.activeSubreddit, 'top', '?t=all')}>
            <i className="fas fa-medal"
              style={this.state.view === "top" ? { color: 'lightgreen' } : { color: 'white' }}>
              <span>Top</span>
            </i>
          </div>
        </Link>
        <Link to="/">
          <div
            className="change new"
            title="View the Newest posts"
            onClick={() => {
              name === 'popular' ? this.submit() : this.fetchPosts(`r/${this.state.activeSubreddit}/new/.json`, this.state.activeSubreddit, 'new')
            }}>
            <i className="fas fa-certificate"
              style={this.state.view === "new" ? { color: 'lightskyblue' } : { color: 'white' }}>
              <span>New</span>
            </i>
          </div>
        </Link>
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
            <p>These are the posts that best fit your query. If you want to search for specific subreddits, the searchbar below will do the trick!</p>
          </div>
        </section>
      );

      //Get subreddit data and display
    } else {
      //Get the active subreddit
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
                <i className="far fa-minus-square" title="Remove this subreddit from your Navigation Bar" style={{ order: '1' }} onClick={() => this.removeSubreddit(display_name)}></i> :
                <i className="far fa-plus-square" title="Add this subreddit to your Navigation Bar" style={{ order: '1' }} onClick={() => this.addSubreddit(display_name)}></i>
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

  //Highlight active subreddit in Nav bar
  highlightActive() {
    let selected = [];
    this.state.nav.forEach(item => {
      if (this.state.activeSubreddit === item) {
        selected.push(item);
      }
    })
    return selected;
  }

  //Add to Nav bar
  addSubreddit(sub) {
    let newNav = this.state.nav;
    const included = newNav.includes(sub);
    if (included === false) {
      this.fetchAbout(sub);
    }
    newNav.push(sub);
    this.setState({ nav: newNav });
  }

  //Remove from Nav bar
  removeSubreddit(sub) {
    let newNav = this.state.nav;
    newNav = newNav.filter(nav => nav !== sub);
    this.setState({ nav: newNav });
  }

  //Update each post with the latest data
  //Note: Retrieving the comments for a post also returns the post
  //      This can cause a discrepancy between the data in state and the returned data, which is why this step is necessary
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

  clearSearch(str) {
    document.getElementById(str).value = "";
  }

  componentDidMount() {
    this.fetchInitialData();
    this.fetchTop();
    this.fetchNavSubs(this.state.nav);
    this.highlightActive();
  }

  render() {
    return (
      <div className="top-container">
        <div className="top-bg"></div>
        <Navbar
          clearSearch={this.clearSearch}
          fetchPosts={this.fetchPosts}
          fetchTop={this.fetchTop}
          highlightActive={this.highlightActive()}
          navItems={this.state.nav}
          subredditsAbout={this.state.subredditsAbout}
        />
        <Main
          about={this.state.subredditsAbout}
          addSubreddit={this.addSubreddit}
          fetchAbout={this.fetchAbout}
          fetchPosts={this.fetchPosts}
          navItems={this.state.nav}
          posts={this.state.posts}
          removeSubreddit={this.removeSubreddit}
          saveScrollPosition={this.saveScrollPosition}
          setScrollPosition={this.setScrollPosition}
          updatePost={this.updatePost}
        />
        <Options
          activeSubreddit={this.state.activeSubreddit}
          addSubreddit={this.addSubreddit}
          clearSearch={this.clearSearch}
          fetchAbout={this.fetchAbout}
          fetchPosts={this.fetchPosts}
          fetchTop={this.fetchTop}
          getSubreddit={this.getSubreddit}
          nav={this.state.nav}
          searchSubs={this.searchSubs}
          searchTerm={this.state.searchTerm}
          top={this.state.top}
        />
      </div>
    )
  }
};

