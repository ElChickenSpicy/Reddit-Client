import React from 'react';
import { Link } from "react-router-dom";
import { decode } from 'html-entities';
import parse from 'html-react-parser';
import * as dayjs from 'dayjs'

export class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            post: [],
            comments: []
        };
        this.commentsFetch = this.commentsFetch.bind(this);
        this.toggleFirstHidden = this.toggleFirstHidden.bind(this);
        this.toggleSecondHidden = this.toggleSecondHidden.bind(this);
    }

    async commentsFetch() {
        //Format the string to make the fetch request
        let str = this.props.rp.location.pathname;
        str = str.substring(9, str.length)
        let queryString = 'https://www.reddit.com' + str + '.json';

        //Request the data from Reddit
        const response = await fetch(queryString);
        const jsonResponse = await response.json();
        this.setState({
            post: jsonResponse[0].data.children,
            comments: jsonResponse[1].data.children
        })
        this.props.updatePost(jsonResponse[0].data.children[0]);
    }

    toggleFirstHidden(toggle) {
        //Toggle the collapsed property of the comment
        toggle.data.collapsed = !toggle.data.collapsed;

        //Set the state with the toggled comment
        this.setState(prevState => ({
            comments: prevState.comments.map(
                comment => comment.data.id === toggle.data.id ? toggle : comment
            )
        })
        )
    }

    toggleSecondHidden(comment, reply) {
        //Toggle the collapsed property of the reply
        let replyIndex = comment.data.replies.data.children.indexOf(reply);
        comment.data.replies.data.children[replyIndex].data.collapsed = !comment.data.replies.data.children[replyIndex].data.collapsed;

        //Set the state with the toggled reply
        this.setState(prevState => ({
            comments: prevState.comments.map(
                c => c.data.id === comment.data.id ? comment : c
            )
        })
        )
    }

    componentDidMount() {
        this.commentsFetch();
        document.querySelector('.top-container').scrollTo(0, 0);
    }

    render() {
        const relativeTime = require('dayjs/plugin/relativeTime')
        dayjs.extend(relativeTime)
        return (
            <div id="posts">
                {this.state.post.map(post => {
                    const subreddit = this.props.about.filter(el => el.name === post.data.subreddit_id);
                    let src = subreddit[0] ? subreddit[0].icon_img !== "" ? subreddit[0].icon_img : "subreddit/popular.webp" : "subreddit/popular.webp";
                    const postOutput = this.props.formatPost(post)
                    return (
                        //Display the post
                        <article className="reddit-post">
                            <div className="post-flex-item sub">
                                <img src={src} alt="icon" />
                                <h3>r/{post.data.subreddit}</h3>
                            </div>
                            {postOutput}
                            <div className="post-flex-item options">
                                <button className="vote up"></button>
                                <span>{post.data.ups > 999 ? (post.data.ups / 1000).toFixed(1) + 'k' : post.data.ups}</span>
                                <button className="vote down"></button>
                                <Link to={`/Comments${[post.data.permalink]}`}><button className="comment-button active"></button></Link>
                                <span>{post.data.num_comments > 999 ? (post.data.num_comments / 1000).toFixed(1) + 'k' : post.data.num_comments}</span>
                                <Link to="/">
                                    <button 
                                    className="back-button"
                                    onClick={() => this.props.setScrollPosition()}
                                    ></button>
                                </Link>
                                <span id="posted-by">Posted by: {post.data.author} ~ {dayjs(dayjs.unix(post.data.created_utc)).fromNow()}</span>
                            </div>
                        </article>
                    );
                })}

                {/* Display the Comments */}
                <section className="comments-container">
                    {this.state.comments.map(comment => {
                        return (
                            //Ensure the comment.kind is not 'more'
                            comment.kind === 'more' ? '' :

                                comment.data.collapsed === false ?
                                    //If the collapsed property is set to false, display the comment and its children
                                    <div className="comment-item">
                                        <h2 
                                            className="username" 
                                            onClick={() => { this.toggleFirstHidden(comment) }}>
                                            u/{comment.data.author} 
                                            <span id="comment-time">
                                                ~ {dayjs(dayjs.unix(comment.data.created_utc)).fromNow()}
                                            </span>
                                        </h2>
                                        <p>{parse(decode(comment.data.body_html))}</p>
                                        <div className="comment-info">
                                            <button className="vote up"></button>
                                            <span>{comment.data.ups > 999 ? (comment.data.ups / 1000).toFixed(1) + 'k' : comment.data.ups }</span>
                                            <button className="vote down"></button>
                                        </div>

                                        {!comment.data.replies.data ? '' :
                                            comment.data.replies.data.children.length <= 1 ? '' :
                                                comment.data.replies.data.children.slice(0, comment.data.replies.data.children.length - 1).map(reply => {
                                                    return (
                                                        reply.data.collapsed === false ?
                                                            //If the collapsed property is set to false, display the reply and its children
                                                            <div className="first-reply-layer">
                                                                <h2 
                                                                className="username" 
                                                                onClick={() => { this.toggleSecondHidden(comment, reply) }}>
                                                                    u/{reply.data.author}
                                                                    <span id="comment-time">
                                                                         ~ {dayjs(dayjs.unix(reply.data.created_utc)).fromNow()}
                                                                    </span>
                                                                </h2>
                                                                <p>{parse(decode(reply.data.body_html))}</p>
                                                                <div className="comment-info">
                                                                    <button className="vote up"></button>
                                                                    <span>{reply.data.ups > 999 ? (reply.data.ups / 1000).toFixed(1) + 'k' : reply.data.ups }</span>
                                                                    <button className="vote down"></button>
                                                                </div>
                                                                {!reply.data.replies.data ? '' :
                                                                    reply.data.replies.data.children.length <= 1 ? '' :
                                                                        reply.data.replies.data.children.slice(0, reply.data.replies.data.children.length - 1).map(secondLayer => {
                                                                            return (
                                                                                <div className="second-reply-layer">
                                                                                    <h2 
                                                                                    className="username">
                                                                                        u/{secondLayer.data.author}
                                                                                        <span id="comment-time">
                                                                                            ~ {dayjs(dayjs.unix(secondLayer.data.created_utc)).fromNow()}
                                                                                        </span>
                                                                                    </h2>
                                                                                    <p>{parse(decode(secondLayer.data.body_html))}</p>
                                                                                    <div className="comment-info">
                                                                                        <button className="vote up"></button>
                                                                                        <span>{secondLayer.data.ups > 999 ? (secondLayer.data.ups / 1000).toFixed(1) + 'k' : secondLayer.data.ups }</span>
                                                                                        <button className="vote down"></button>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                }
                                                            </div> :
                                                            //If the collapsed property is set to true, hide the reply and its children
                                                            <div className="first-reply-layer" onClick={() => { this.toggleSecondHidden(comment, reply) }}>
                                                                <h2 className="username">u/{reply.data.author}</h2>
                                                                <p>...</p>
                                                            </div>
                                                    )
                                                })
                                        }
                                    </div> :

                                    //If the collapsed property is set to true, hide the comment and its children
                                    <div className="comment-item">
                                        <h2 className="username" onClick={() => { this.toggleFirstHidden(comment) }}>u/{comment.data.author}</h2>
                                        <p>...</p>
                                    </div>
                        )
                    })}
                </section>
            </div>
        )
    }
};