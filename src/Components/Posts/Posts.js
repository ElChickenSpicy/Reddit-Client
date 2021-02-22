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
                                <span>{post.data.ups > 999 ? (post.data.ups / 1000).toFixed(1) + 'k' : post.data.ups }</span>
                                <button className="vote down"></button>
                                <Link to={`/Comments${[post.data.permalink]}`}><button className="comment-button home"></button></Link>
                                <span>{post.data.num_comments > 999 ? (post.data.num_comments / 1000).toFixed(1) + 'k' : post.data.num_comments}</span>
                                <span id="posted-by">Posted by: {post.data.author}</span>
                            </div>
                        </article>
                    );
                })}
            </div>
        )
    }
};