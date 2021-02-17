import React from 'react';
import { Link } from "react-router-dom";

export class Posts extends React.Component {
    render() {
        return (
            <div id="posts">
                <article className="reddit-post">
                    <div className="post-flex-item sub">
                        <img alt="icon" />
                        <h3>r/something</h3>
                    </div>
                    <div className="post-flex-item content">
                        <h1 className="content-title">Title of Post</h1>
                        <p className="content-media">Content of the post</p>
                    </div>
                    <div className="post-flex-item options">
                        <button>Upvote</button>
                        <button>Downvote</button>
                        <Link to="/Comments"><button>Comments</button></Link>
                    </div>
                </article>

                <article className="reddit-post">
                    <div className="post-flex-item sub">
                        <img alt="icon" />
                        <h3>r/something</h3>
                    </div>
                    <div className="post-flex-item content">
                        <h1 className="content-title">Title of Post</h1>
                        <p className="content-media">Content of the post</p>
                    </div>
                    <div className="post-flex-item options">
                        <button>Upvote</button>
                        <button>Downvote</button>
                        <Link to="/Comments"><button>Comments</button></Link>
                    </div>
                </article>

                <article className="reddit-post">
                    <div className="post-flex-item sub">
                        <img alt="icon" />
                        <h3>r/something</h3>
                    </div>
                    <div className="post-flex-item content">
                        <h1 className="content-title">Title of Post</h1>
                        <p className="content-media">Content of the post</p>
                    </div>
                    <div className="post-flex-item options">
                        <button>Upvote</button>
                        <button>Downvote</button>
                        <Link to="/Comments"><button>Comments</button></Link>
                    </div>
                </article>

                <article className="reddit-post">
                    <div className="post-flex-item sub">
                        <img alt="icon" />
                        <h3>r/something</h3>
                    </div>
                    <div className="post-flex-item content">
                        <h1 className="content-title">Title of Post</h1>
                        <p className="content-media">Content of the post</p>
                    </div>
                    <div className="post-flex-item options">
                        <button>Upvote</button>
                        <button>Downvote</button>
                        <Link to="/Comments"><button>Comments</button></Link>
                    </div>
                </article>
            </div>
        )
    }
};