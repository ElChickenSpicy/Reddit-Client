import React from 'react';
import './App.css';

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
            <h2>Current Page</h2>
            <div>
              <img alt="icon" />
              <h1>Sean's Reddit App</h1>
            </div>
          </header>

          <article className="reddit-post">
            <div className="post-flex-item sub">
              <img alt="icon"/>
              <h3>r/something</h3>
            </div>
            <div className="post-flex-item content">
              <h1 className="content-title">Title of Post</h1>
              <p className="content-media">Content of the post</p>
            </div>
            <div className="post-flex-item options">
              <button>Upvote</button>
              <button>Downvote</button>
              <button>Comments</button>
            </div>
          </article>

          <article className="reddit-post">
            <div className="post-flex-item sub">
              <img alt="icon"/>
              <h3>r/something</h3>
            </div>
            <div className="post-flex-item content">
              <h1 className="content-title">Title of Post</h1>
              <p className="content-media">Content of the post</p>
            </div>
            <div className="post-flex-item options">
              <button>Upvote</button>
              <button>Downvote</button>
              <button>Comments</button>
            </div>
          </article>

          <article className="reddit-post">
            <div className="post-flex-item sub">
              <img alt="icon"/>
              <h3>r/something</h3>
            </div>
            <div className="post-flex-item content">
              <h1 className="content-title">Title of Post</h1>
              <p className="content-media">Content of the post</p>
            </div>
            <div className="post-flex-item options">
              <button>Upvote</button>
              <button>Downvote</button>
              <button>Comments</button>
            </div>
          </article>

          <article className="reddit-post">
            <div className="post-flex-item sub">
              <img alt="icon"/>
              <h3>r/something</h3>
            </div>
            <div className="post-flex-item content">
              <h1 className="content-title">Title of Post</h1>
              <p className="content-media">Content of the post</p>
            </div>
            <div className="post-flex-item options">
              <button>Upvote</button>
              <button>Downvote</button>
              <button>Comments</button>
            </div>
          </article>

        </main>

      </div>
    )
  }
};

