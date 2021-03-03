import React from 'react';
import { Link } from "react-router-dom";
import { decode } from 'html-entities';
import parse from 'html-react-parser';
import * as dayjs from 'dayjs';

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
        this.flairExists = this.flairExists.bind(this);
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
        }));
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
        }));
    }

    flairExists(kind, flair) {
        let commentFlair = kind === 'more' ? '' : flair.length > 0 ? flair[0].u ?
        <img src={flair[0].u} alt="Author's flair" title={flair[0].a} />
        : ''
        : '';
        return commentFlair;
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
                    return this.props.displayPost(post);
                })}

                {/* Back Button */}
                <Link to="/" id="back">
                    <button 
                    className="back" 
                    title="Go Back"
                    onClick={() => this.props.setScrollPosition()}
                    >&#171;
                    </button>
                </Link>

                {/* Display the Comments */}
                <section className="comments-container">
                    {this.state.comments.map(comment => {
                        //Object destructuring
                        const { kind, data: { author, author_flair_richtext, body_html, collapsed, created_utc, replies, ups } } = comment;
                        //Does Author have a flair?                       
                        let commentFlair = this.flairExists(kind, author_flair_richtext);
                        return (
                            //Ensure the comment kind is not 'more'
                            kind === 'more' ? '' :

                                collapsed === false ?
                                    //If the collapsed property is set to false, display the comment and its children
                                    <div className="comment-item">
                                        <div className="author">
                                            {commentFlair}
                                            <h2 className="username" onClick={() => { this.toggleFirstHidden(comment) }}>
                                                u/{author}
                                                <span id="comment-time">
                                                    ~ {dayjs(dayjs.unix(created_utc)).fromNow()}
                                                </span>
                                            </h2>
                                        </div>
                                        <p>{parse(decode(body_html))}</p>
                                        <div className="comment-info">
                                            <button className="vote up"></button>
                                            <span>{ups > 999 ? (ups / 1000).toFixed(1) + 'k' : ups}</span>
                                            <button className="vote down"></button>
                                        </div>

                                        {!replies.data ? '' :
                                            replies.data.children.length <= 1 ? '' :
                                                replies.data.children.slice(0, replies.data.children.length - 1).map(reply => {
                                                    //Object destructuring
                                                    const { kind: r_kind, data: { 
                                                        author: r_author, author_flair_richtext: r_author_flair_richtext, body_html: r_body_html, collapsed: r_collapsed, created_utc: r_created_utc, replies: r_replies, ups: r_ups 
                                                    }} = reply;
                                                    //Does Author have a flair?
                                                    let fLayerFlair = this.flairExists(r_kind, r_author_flair_richtext);
                                                    return (
                                                        //Ensure the reply kind is not 'more'
                                                        r_kind === 'more' ? '' :
                                                        r_collapsed === false ?
                                                            //If the collapsed property is set to false, display the reply and its children
                                                            <div className="first-reply-layer">
                                                                <div className="author">
                                                                    {fLayerFlair}
                                                                    <h2 className="username" onClick={() => { this.toggleSecondHidden(comment, reply) }}>
                                                                        u/{r_author}
                                                                        <span id="comment-time">
                                                                            ~ {dayjs(dayjs.unix(r_created_utc)).fromNow()}
                                                                        </span>
                                                                    </h2>
                                                                </div>
                                                                <p>{parse(decode(r_body_html))}</p>
                                                                <div className="comment-info">
                                                                    <button className="vote up"></button>
                                                                    <span>{r_ups > 999 ? (r_ups / 1000).toFixed(1) + 'k' : r_ups}</span>
                                                                    <button className="vote down"></button>
                                                                </div>
                                                                {!r_replies.data ? '' :
                                                                    r_replies.data.children.length <= 1 ? '' :
                                                                        r_replies.data.children.slice(0, r_replies.data.children.length - 1).map(secondLayer => {
                                                                            //Object destructuring
                                                                            const { kind: s_kind, data: { 
                                                                                author: s_author, author_flair_richtext: s_author_flair_richtext, body_html: s_body_html, created_utc: s_created_utc, ups: s_ups
                                                                            }} = secondLayer;
                                                                            //Does Author have a flair?
                                                                            let sLayerFlair = this.flairExists(s_kind, s_author_flair_richtext);
                                                                            return (
                                                                                //Ensure the reply kind is not 'more'
                                                                                s_kind === 'more' ? '' :
                                                                                <div className="second-reply-layer">
                                                                                    <div className="author">
                                                                                        {sLayerFlair}
                                                                                        <h2 className="username">
                                                                                            u/{s_author}
                                                                                            <span id="comment-time">
                                                                                                ~ {dayjs(dayjs.unix(s_created_utc)).fromNow()}
                                                                                            </span>
                                                                                        </h2>
                                                                                    </div>
                                                                                    <p>{parse(decode(s_body_html))}</p>
                                                                                    <div className="comment-info">
                                                                                        <button className="vote up"></button>
                                                                                        <span>{s_ups > 999 ? (s_ups / 1000).toFixed(1) + 'k' : s_ups}</span>
                                                                                        <button className="vote down"></button>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })
                                                                }
                                                            </div> :
                                                            //If the collapsed property is set to true, hide the reply and its children
                                                            <div className="first-reply-layer" onClick={() => { this.toggleSecondHidden(comment, reply) }}>
                                                                <h2 className="username">u/{r_author}</h2>
                                                                <p>...</p>
                                                            </div>
                                                    )
                                                })
                                        }
                                    </div> :
                                    //If the collapsed property is set to true, hide the comment and its children
                                    <div className="comment-item">
                                        <h2 className="username" onClick={() => { this.toggleFirstHidden(comment) }}>u/{author}</h2>
                                        <p>...</p>
                                    </div>
                        )
                    })}
                </section>
            </div>
        )
    }
};