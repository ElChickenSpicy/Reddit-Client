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
    this.changeView = this.changeView.bind(this);
    this.checkData = this.checkData.bind(this);
    this.clearSearch = this.clearSearch.bind(this);
    this.fetchAbout = this.fetchAbout.bind(this);
    this.fetchInitialData = this.fetchInitialData.bind(this);
    this.fetchNavSubs = this.fetchNavSubs.bind(this);
    this.fetchSubredditData = this.fetchSubredditData.bind(this);
    this.fetchTop = this.fetchTop.bind(this);
    this.getSubreddit = this.getSubreddit.bind(this);
    this.highlightActive = this.highlightActive.bind(this);
    this.removeSubreddit = this.removeSubreddit.bind(this);
    this.saveScrollPosition = this.saveScrollPosition.bind(this);
    this.search = this.search.bind(this);
    this.searchSubs = this.searchSubs.bind(this);
    this.setScrollPosition = this.setScrollPosition.bind(this);
    this.submit = this.submit.bind(this);
    this.updatePost = this.updatePost.bind(this);
  }

  //Fetch the initial posts set of posts to be displayed
  async fetchInitialData() {
    const response = await fetch('https://www.reddit.com/r/popular.json');
    if (response.ok) {
      const jsonResponse = await response.json();

      const popularPosts = jsonResponse.data.children.slice(0, 10);
      this.setState({ posts: popularPosts });

      //For each post in state, grab the corresponding subreddit data
      this.state.posts.forEach(({ data: { subreddit } }) => {
        this.fetchAbout(subreddit);
      });
    }
  }

  //Fecth the subreddit data of each sub in the 'My Subreddits' section
  fetchNavSubs(arr) {
    arr.forEach(async sub => {
      //If it already exists in state, don't make the request
      let exists = this.state.subredditsAbout.filter(el => el.display_name === sub);
      if (exists.length === 0) {
        const response = await fetch(`https://www.reddit.com/r/${sub}/about/.json`);
        if (response.ok) {
          const jsonResponse = await response.json();
          const subreddit = jsonResponse.data;

          //Update the state with any new subreddit data fetched
          this.setState({ subredditsAbout: [...this.state.subredditsAbout, subreddit] });
        }
      }
    });
  }

  //Return the about data of the given subreddit
  //This data is important because it allows for dynamic subreddit icons and descriptions
  async fetchAbout(post) {
    const response = await fetch(`https://www.reddit.com/r/${post}/about/.json`);
    if (response.ok) {
      const jsonResponse = await response.json();
      const subreddit = jsonResponse.data;

      //If the array of subreddit about data is empty, add the first element
      if (this.state.subredditsAbout.length <= 0) {
        this.setState({ subredditsAbout: [subreddit] });

        //Otherwise, check if the subreddit data already exists in state
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

  //Fetch posts from the given subreddit
  async fetchSubredditData(sub) {
    const response = await fetch(`https://www.reddit.com/r/${sub}.json`);
    if (response.ok) {
      const jsonResponse = await response.json();

      const subPosts = jsonResponse.data.children.slice(0, 10);
      this.setState({ posts: subPosts, activeSubreddit: sub, view: 'hot' });

      this.checkData();
    }
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

  //Fetch the top 10 subreddits
  async fetchTop() {
    const response = await fetch('https://www.reddit.com/subreddits/.json');
    if (response.ok) {
      const jsonResponse = await response.json();
      let topSubs = jsonResponse.data.children.slice(0, 11);

      //Remove the 1st element, as it is r/Home (seems to be bug on Reddit's side)
      topSubs.shift();
      this.setState({ top: topSubs, searchTerm: 'Top Subreddits' });
    }
  }

  //Search subreddits with a query string
  async searchSubs(query, str) {
    const response = await fetch(query);
    if (response.ok) {
      const jsonResponse = await response.json();

      //Return the first 8 results and display the search term used
      const searchPosts = jsonResponse.data.children.slice(0, 8);
      this.setState({ top: searchPosts, searchTerm: `${str}...` });
    }
  }

  //View the Hottest, Top or Newest posts of a given subreddit
  async changeView(sub, view, query = '') {
    const response = await fetch(`https://www.reddit.com/r/${sub}/${view}/.json${query}`);
    if (response.ok) {
      const jsonResponse = await response.json();

      const subPosts = jsonResponse.data.children.slice(0, 10);
      this.setState({ posts: subPosts, activeSubreddit: sub, view: view });

      this.checkData();
    }
  }

  //Search reddit posts using a query string
  async search(query, str) {
    const response = await fetch(query);
    if (response.ok) {
      const jsonResponse = await response.json();

      const subPosts = jsonResponse.data.children.slice(0, 10);
      this.setState({ posts: subPosts, activeSubreddit: `Search Results: ${str}`, view: 'hot' });

      this.checkData();
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

  //Data and JSX for the Top right menu (current position view)
  getSubreddit(name) {
    //Resusable JSX element
    const view =
      <div className="change-view">
        <Link to="/">
          <div
            className="change hot"
            title="View the Hottest posts"
            onClick={() => this.changeView(this.state.activeSubreddit, 'hot')}>
            <i className="fas fa-fire-alt"
              style={this.state.view == "hot" ? { color: 'lightcoral' } : { color: 'white' }}>
              <span>Hot</span>
            </i>
          </div>
        </Link>
        <Link to="/">
          <div
            className="change top"
            title="View the Top posts of all time"
            onClick={() => this.changeView(this.state.activeSubreddit, 'top', '?t=all')}>
            <i className="fas fa-medal"
              style={this.state.view == "top" ? { color: 'lightgreen' } : { color: 'white' }}>
              <span>Top</span>
            </i>
          </div>
        </Link>
        <Link to="/">
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
        </Link>
      </div>

    //If it's r/popular, do some specific things because r/popular isn't actually a subreddit
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

      //Likewise, if its the Search Results, do some specific things as it isn't a subreddit
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

      //Get the subreddit data and display it
    } else {
      //Get the active subreddit and destructure variables
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

  //Highlight the active subreddit in the Navigation bar
  highlightActive() {
    let selected = [];
    this.state.nav.forEach(item => {
      if (this.state.activeSubreddit === item) {
        selected.push(item);
      }
    })
    return selected;
  }

  //Add a subreddit to the Navigation bar
  addSubreddit(sub) {
    let newNav = this.state.nav;
    const included = newNav.includes(sub);
    if (included === false) {
      this.fetchAbout(sub);
    }
    newNav.push(sub);
    this.setState({ nav: newNav });
  }

  //Remove a subreddit from the Navigation bar
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

  //Save the scroll position in state
  saveScrollPosition() {
    this.setState({ scrollPosition: [window.scrollX, window.scrollY] });
  }

  //Set the scroll position
  setScrollPosition() {
    window.scrollTo(...this.state.scrollPosition);
  }

  //Clear the passed in search box
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
        <Navbar
          navItems={this.state.nav}
          fetchSubredditData={this.fetchSubredditData}
          highlightActive={this.highlightActive()}
          search={this.search}
          subredditsAbout={this.state.subredditsAbout}
          clearSearch={this.clearSearch}
          fetchTop={this.fetchTop}
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
          top={this.state.top}
          fetchSubredditData={this.fetchSubredditData}
          fetchAbout={this.fetchAbout}
          searchSubs={this.searchSubs}
          clearSearch={this.clearSearch}
          searchTerm={this.state.searchTerm}
          addSubreddit={this.addSubreddit}
          removeSubreddit={this.removeSubreddit}
          nav={this.state.nav}
          fetchTop={this.fetchTop}
        />
      </div>
    )
  }
};

