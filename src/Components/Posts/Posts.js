import React from 'react';
import { Link } from "react-router-dom";
import * as dayjs from 'dayjs'

export class Posts extends React.Component {
    render() {
        //Dayjs setup
        const relativeTime = require('dayjs/plugin/relativeTime')
        dayjs.extend(relativeTime)

        return (
            <div id="posts">
                {this.props.initialPosts.map(post => {
                    //Object destructuring
                    const { data: { all_awardings, author, created_utc, num_comments, permalink, subreddit, subreddit_id, ups } } = post;
                    //Retrieve image src and title for the subreddit's info
                    const icon = this.props.about.filter(el => el.name === subreddit_id);
                    let src = icon[0] ? icon[0].icon_img !== "" && icon[0].icon_img !== null ? icon[0].icon_img : "subreddit/popular.webp" : "subreddit/popular.webp";
                    let title = icon[0] ? icon[0].title !== "" && icon[0].title !== null ? icon[0].title : {subreddit} : {subreddit};
                    //Pass the post to the formatPost function
                    const postOutput = this.props.formatPost(post);
                    return (
                        <article className="reddit-post">
                            <Link to="/">
                                <div className="post-flex-item sub"> 
                                    <img
                                        src={src}
                                        alt={subreddit}
                                        title={title}
                                    />
                                    <h3 title={title} onClick={() => {this.props.fetchSubredditData(subreddit)}}>r/{subreddit}</h3>
                                    <div className="awards-container">
                                        {all_awardings.length > -1 ?
                                        all_awardings.map(el => {
                                            return <div className="award"><img src={el.icon_url} alt={el.name} title={el.name + '\n' + el.description}/>x{el.count}</div>
                                        }) : '' }
                                    </div>
                                </div>
                            </Link> 
                            {postOutput}
                            <div className="post-flex-item options">
                                <button className="vote up"></button>
                                <span>{ups > 999 ? (ups / 1000).toFixed(1) + 'k' : ups }</span>
                                <button className="vote down"></button>
                                <Link 
                                to={`/Comments${[permalink]}`}>
                                    <button 
                                    className="comment-button home"
                                    onClick={() => this.props.saveScrollPosition()}
                                    ></button>
                                </Link>
                                <span>{num_comments > 999 ? (num_comments / 1000).toFixed(1) + 'k' : num_comments}</span>
                                <span id="posted-by">Posted by: {author} ~ {dayjs(dayjs.unix(created_utc)).fromNow()}</span>
                            </div> 
                        </article>
                    );
                })}
            </div>
        )
    }
};