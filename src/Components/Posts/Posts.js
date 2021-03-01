import React from 'react';
import { Link } from "react-router-dom";
import * as dayjs from 'dayjs'

export class Posts extends React.Component {
    render() {
        const relativeTime = require('dayjs/plugin/relativeTime')
        dayjs.extend(relativeTime)
        return (
            <div id="posts">
                {this.props.initialPosts.map(post => {
                    const subreddit = this.props.about.filter(el => el.name === post.data.subreddit_id);
                    const postOutput = this.props.formatPost(post);
                    return (
                        <article className="reddit-post">
                            <Link to="/">
                                <div className="post-flex-item sub">
                                    {/* onError tag taken from Stack Overflow on 23/2/2021 from Deepak Mallah
                                    URL: https://stackoverflow.com/questions/34097560/react-js-replace-img-src-onerror */}
                                    <img 
                                        src={subreddit[0] ? subreddit[0].icon_img : "subreddit/reddit.webp" } 
                                        alt="icon" 
                                        onError={(e)=>{e.target.onerror = null; e.target.src="subreddit/reddit.webp"}}
                                    />
                                    {/* <img src={"subreddit/" + post.data.subreddit + ".webp"} alt="icon" onError={(e)=>{e.target.onerror = null; e.target.src="subreddit/reddit.webp"}}/> */}
                                    <h3 onClick={() => {this.props.fetchSubredditData(post.data.subreddit)}}>r/{post.data.subreddit}</h3>
                                </div>
                            </Link> 
                            {postOutput}
                            <div className="post-flex-item options">
                                <button className="vote up"></button>
                                <span>{post.data.ups > 999 ? (post.data.ups / 1000).toFixed(1) + 'k' : post.data.ups }</span>
                                <button className="vote down"></button>
                                <Link to={`/Comments${[post.data.permalink]}`}><button className="comment-button home"></button></Link>
                                <span>{post.data.num_comments > 999 ? (post.data.num_comments / 1000).toFixed(1) + 'k' : post.data.num_comments}</span>
                                <span id="posted-by">Posted by: {post.data.author} ~ {dayjs(dayjs.unix(post.data.created_utc)).fromNow()}</span>
                            </div> 
                        </article>
                    );
                })}
            </div>
        )
    }
};