import React from 'react';
import { Link } from "react-router-dom";

export class Posts extends React.Component {
    render() {
        return (
            <div id="posts">
                {this.props.initialPosts.map(post => {
                    const postOutput = this.props.formatPost(post)
                    return (
                        <article className="reddit-post">
                            <div className="post-flex-item sub">
                                <img alt="icon" />
                                <h3>r/{post.data.subreddit}</h3>
                            </div>
                            {postOutput}
                            <div className="post-flex-item options">
                                <button className="vote up"></button>
                                <button className="vote down"></button>
                                <Link to={`/Comments${[post.data.permalink]}`}><button className="comment-button"></button></Link>
                            </div>
                        </article>
                    );
                })}
            </div>
        )
    }
};