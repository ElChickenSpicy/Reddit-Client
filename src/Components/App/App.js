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
      nav: ['soccer', 'Art', 'ProgrammerHumor', 'AskReddit', 'dataisbeautiful', 'TwoXChromosomes', 'food', 'pics', 'lgbt'],
      top: [],
      searchTerm: '',
      subredditsAbout: [],
      view: 'hot',
      scrollPosition: [],
      after: '',
      displayNumber: 10,
      loading: true,
      hasMore: true,
      mobileNavigation: 'home'
    };
    this.addSubreddit = this.addSubreddit.bind(this);
    this.checkDataExists = this.checkDataExists.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.fetchAboutData = this.fetchAboutData.bind(this);
    this.fetchNavbarSubs = this.fetchNavbarSubs.bind(this);
    this.fetchPosts = this.fetchPosts.bind(this);
    this.fetchTopSubreddits = this.fetchTopSubreddits.bind(this);
    this.getCurrentSubreddit = this.getCurrentSubreddit.bind(this);
    this.hideElement = this.hideElement.bind(this);
    this.highlightActive = this.highlightActive.bind(this);
    this.increaseDisplay = this.increaseDisplay.bind(this);
    this.makeRequest = this.makeRequest.bind(this);
    this.removeSubreddit = this.removeSubreddit.bind(this);
    this.resetLikes = this.resetLikes.bind(this);
    this.saveScrollPosition = this.saveScrollPosition.bind(this);
    this.searchSubreddits = this.searchSubreddits.bind(this);
    this.setScrollPosition = this.setScrollPosition.bind(this);
    this.showElement = this.showElement.bind(this);
    this.submit = this.submit.bind(this);
    this.updateMobileNavigation = this.updateMobileNavigation.bind(this);
    this.updatePost = this.updatePost.bind(this);
  }

  async makeRequest(query) {
    try {
      this.setState({ loading: true });
      console.log(`https://www.reddit.com/${query}`);

      const response = await fetch(`https://www.reddit.com/${query}`);
      if (response.ok) {
        const jsonResponse = await response.json();
        this.setState({ loading: false })
        return jsonResponse;
      }
    } catch (err) {
      alert(err);
    }
  }

  async fetchPosts(obj) {
    const view = obj.view || 'hot'
    const more = obj.more || false
    const { data, data: { children: subPosts } } = await this.makeRequest(obj.query);
    this.setState({
      posts: more === false ? subPosts : [...this.state.posts, ...subPosts],
      activeSubreddit: obj.active,
      view: view,
      after: data.after,
      displayNumber: more === false ? 10 : obj.displayNum,
      hasMore: data.after === null ? false : true
    });

    this.checkDataExists(more);
    this.resetLikes();
  }

  checkDataExists(more) {
    this.state.posts.forEach(({ data: { subreddit, subreddit_id } }) => {
      let exists = this.state.subredditsAbout.filter(({ name }) => {
        return name === subreddit_id;
      });
      if (exists.length === 0) {
        this.fetchAboutData(subreddit);
      }
    });

    if (more === false) {
      window.scrollTo(0, 0);
    }
  }

  fetchNavbarSubs(arr) {
    arr.forEach(async sub => {
      //If already captured, don't make request
      let exists = this.state.subredditsAbout.filter(el => el.display_name === sub);
      if (exists.length === 0) {
        const jsonResponse = await this.makeRequest(`r/${sub}/about/.json`);
        const subreddit = jsonResponse?.data ?? 'Not Found';
        if (subreddit === 'Not Found') return;
        this.setState({ subredditsAbout: [...this.state.subredditsAbout, subreddit] });
      }
    });
  }

  async fetchAboutData(post) {
    const { data: subreddit } = await this.makeRequest(`r/${post}/about/.json`);
    //Add element if empty, otherwise check if it exists
    if (this.state.subredditsAbout.length <= 0) {
      return this.setState({ subredditsAbout: [subreddit] });
    }
    const copy = this.state.subredditsAbout;
    let exists = copy.filter(({ name }) => {
      return name === subreddit.name;
    });
    if (exists.length === 0) {
      this.setState({ subredditsAbout: [...copy, subreddit] });
    }
  }

  async fetchTopSubreddits() {
    const { data: { children: topSubs } } = await this.makeRequest('subreddits/.json');
    //Remove the 1st element, as its r/Home (bug on Reddit's side)
    topSubs.shift();
    this.setState({ top: topSubs.slice(0, 11), searchTerm: 'Top Subreddits' });
  }

  async searchSubreddits([query, str]) {
    if (query && str) {
      const { data: { children: searchPosts } } = await this.makeRequest(query);
      this.setState({ top: searchPosts.slice(0, 8), searchTerm: `${str}...` });
    }
  }

  //Alert if search r/all by new
  submit() {
    confirmAlert({
      title: 'Please Note:',
      message: 'Filtering r/popular by NEW can occasionally return Not Safe For Work (NSFW) content.',
      buttons: [
        {
          label: 'Continue',
          onClick: () => this.fetchPosts({
            query: `r/${this.state.activeSubreddit}/new/.json`,
            active: this.state.activeSubreddit,
            view: 'new'
          })
        },
        {
          label: 'Cancel',
        }
      ]
    });
  }

  getCurrentSubreddit(name) {
    //Resusable JSX element
    const view =
      <div className="change-view">
        <Link to="/">
          <div
            className="change hot"
            title="View the Hottest posts"
            onClick={() => this.fetchPosts({
              query: `r/${this.state.activeSubreddit}/hot/.json`,
              active: this.state.activeSubreddit,
              view: 'hot'
            })}
          >
            <i className="fas fa-fire-alt"
              style={this.state.view === "hot" ? { color: 'lightcoral' } : { color: 'lightgray' }}>
              <span>Hot</span>
            </i>
          </div>
        </Link>
        <Link to="/">
          <div
            className="change top"
            title="View the Top posts of all time"
            onClick={() => this.fetchPosts({
              query: `r/${this.state.activeSubreddit}/top/.json?t=all`,
              active: this.state.activeSubreddit,
              view: 'top'
            })}
          >
            <i className="fas fa-medal"
              style={this.state.view === "top" ? { color: 'lightgreen' } : { color: 'lightgray' }}>
              <span>Top</span>
            </i>
          </div>
        </Link>
        <Link to="/">
          <div
            className="change new"
            title="View the Newest posts"
            onClick={() => {
              name === 'popular' ? this.submit() : this.fetchPosts({
                query: `r/${this.state.activeSubreddit}/new/.json`,
                active: this.state.activeSubreddit,
                view: 'new'
              })
            }}
          >
            <i className="fas fa-certificate"
              style={this.state.view === "new" ? { color: 'lightskyblue' } : { color: 'lightgray' }}>
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
    }
    if (name.startsWith('Search Results: ')) {
      return (
        <section className="current-view">
          <div className="active-subreddit">
            <h3>You Searched For...</h3>
            <h1>{name.split(":")[1]}</h1>
            <p>These are the posts that best fit your query. If you want to search for specific subreddits, the searchbar below will do the trick!</p>
          </div>
        </section>
      );
    }

    //Get subreddit data and display
    const active = this.state.subredditsAbout.filter(el => name === el.display_name);
    const { accounts_active, display_name, public_description, subscribers } = active[0];
    return (
      <section className="current-view">
        <div className="active-subreddit">
          <h3>Current Subreddit</h3>
          <div className="add-remove">
            {this.state.nav.includes(display_name) ?
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

  highlightActive() {
    return this.state.nav.filter(item => item === this.state.activeSubreddit);
  }

  addSubreddit(sub) {
    const included = this.state.nav.includes(sub);
    if (included === false) this.fetchAboutData(sub);
    this.setState(prevState => ({ nav: [...prevState.nav, sub] }));
  }

  removeSubreddit(sub) {
    this.setState(prevState => ({ nav: prevState.nav.filter(item => item !== sub) }));
  }

  resetLikes() {
    [...document.getElementsByClassName('bi')].forEach(el => {
      el.style.color = '';
    })
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

  updateMobileNavigation(location) {
    this.setState({ mobileNavigation: location });
  }

  clearSearch(str) {
    document.getElementById(str).value = "";
  }

  increaseDisplay(i) {
    this.setState(prevState => ({
      displayNumber: prevState.displayNumber + i
    }));
  }

  hideElement(arr) {
    arr.forEach(el => document.getElementById(el).style.display = 'none');
  }

  showElement(arr) {
    arr.forEach(el => document.getElementById(el).style.display = 'flex');
  }

  componentDidMount() {
    this.fetchPosts({
      query: 'r/popular.json',
      active: 'popular'
    })
    this.fetchTopSubreddits();
    this.fetchNavbarSubs(this.state.nav);
    this.highlightActive();
  }

  render() {
    return (
      <div className="top-container">
        <div className="top-bg"></div>
        <Navbar
          fetchPosts={this.fetchPosts}
          fetchTopSubreddits={this.fetchTopSubreddits}
          hideElement={this.hideElement}
          highlightActive={this.highlightActive()}
          mobileNavigation={this.state.mobileNavigation}
          navItems={this.state.nav}
          saveScrollPosition={this.saveScrollPosition}
          setScrollPosition={this.setScrollPosition}
          showElement={this.showElement}
          subredditsAbout={this.state.subredditsAbout}
          updateMobileNavigation={this.updateMobileNavigation}
        />
        <Main
          about={this.state.subredditsAbout}
          activeSubreddit={this.state.activeSubreddit}
          after={this.state.after}
          displayNumber={this.state.displayNumber}
          hasMore={this.state.hasMore}
          fetchPosts={this.fetchPosts}
          increaseDisplay={this.increaseDisplay}
          loading={this.state.loading}
          posts={this.state.posts}
          saveScrollPosition={this.saveScrollPosition}
          setScrollPosition={this.setScrollPosition}
          updatePost={this.updatePost}
          view={this.state.view}
        />
        <Options
          activeSubreddit={this.state.activeSubreddit}
          addSubreddit={this.addSubreddit}
          clearSearch={this.clearSearch}
          fetchAboutData={this.fetchAboutData}
          fetchPosts={this.fetchPosts}
          fetchTopSubreddits={this.fetchTopSubreddits}
          hideElement = {this.hideElement}
          getCurrentSubreddit={this.getCurrentSubreddit}
          nav={this.state.nav}
          searchSubreddits={this.searchSubreddits}
          searchTerm={this.state.searchTerm}
          showElement={this.showElement}
          top={this.state.top}
          updateMobileNavigation={this.updateMobileNavigation}
        />
      </div>
    )
  }
};

