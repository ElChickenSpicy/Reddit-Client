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
            comments: [],
            sort: '?sort=confidence'
        };
        this.commentsFetch = this.commentsFetch.bind(this);
        this.toggleFirstHidden = this.toggleFirstHidden.bind(this);
        this.toggleSecondHidden = this.toggleSecondHidden.bind(this);
        this.flairExists = this.flairExists.bind(this);
    }

    async commentsFetch(sort = '?sort=confidence') {
        //Format the string to make the fetch request
        let str = this.props.rp.location.pathname;
        str = str.substring(9, str.length)

        //Request the data from Reddit
        const response = await fetch(`https://www.reddit.com${str}.json${sort}`); 
        const jsonResponse = await response.json();
        this.setState({
            post: jsonResponse[0].data.children,
            comments: jsonResponse[1].data.children,
            sort: sort
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
        let commentFlair = 
        flair === undefined ? '' :
        kind === 'more' ? '' :
        flair.length > 0 ? 
        flair[0].u ?
        <img src={flair[0].u} alt="Author's flair" title={flair[0].a} />
        : ''
        : '';
        return commentFlair;
    }

    componentDidMount() {
        this.commentsFetch();
        window.scrollTo(0, 0);
    }

    render() {
        const relativeTime = require('dayjs/plugin/relativeTime')
        dayjs.extend(relativeTime)
        return (
            <div id="posts">
                {this.state.post.map(post => {
                    return this.props.displayPost(post);
                })}

               <div className="comment-navigation">
                    {/* Back Button */}
                    <Link to="/" onClick={() => this.props.setScrollPosition()}>
                        <i class="fas fa-chevron-left" title="Go Back"></i>
                    </Link>
                    {/* Sort Menu */}
                    <div className="sort-comments">
                        <span id="label">Sorted by</span>
                        <div id="current-sort">
                            {this.state.sort === '?sort=confidence' ? 'HOT' : this.state.sort === '?sort=top' ? 'TOP' : this.state.sort === '?sort=new' ? 'NEW' : ''}
                            <i class="fas fa-sort-down"></i>
                            <div className="sort-menu">
                                <button title="Sort Comments by Hot" onClick={() => this.commentsFetch('?sort=confidence')}>
                                    <i 
                                    className="fas fa-fire-alt sort"
                                    style={this.state.sort === '?sort=confidence' ? {color: 'dodgerblue'} : { color: 'rgb(190, 190, 190)'}}>
                                        <span>Hot</span>
                                    </i>
                                </button>
                                <button title="Sort Comments by Top" onClick={() => this.commentsFetch('?sort=top')}>
                                    <i 
                                    className="fas fa-medal sort"
                                    style={this.state.sort === '?sort=top' ? {color: 'dodgerblue'} : { color: 'rgb(190, 190, 190)'}}>
                                        <span>Top</span>
                                    </i>
                                </button>
                                <button title="Sort Comments by New" onClick={() => this.commentsFetch('?sort=new')}>
                                    <i 
                                    className="fas fa-certificate sort"
                                    style={this.state.sort === '?sort=new' ? {color: 'dodgerblue'} : { color: 'rgb(190, 190, 190)'}}>
                                        <span>New</span>
                                    </i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Display the Comments */}
                <section className="comments-container">
                    {this.state.comments.map(comment => {
                        //Object destructuring
                        const { kind, data: { author, author_flair_richtext, body_html, collapsed, created_utc, is_submitter, replies, ups } } = comment;
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
                                            <h2 
                                            className="username" 
                                            onClick={() => { this.toggleFirstHidden(comment) }}
                                            style={is_submitter === true ? {color: "dodgerblue"} : {color: "black"}}
                                            title={is_submitter === true ? 'This user is the Original Poster' : ''}>
                                                u/{author}
                                                <span id="comment-time">
                                                    ~ {dayjs(dayjs.unix(created_utc)).fromNow()}
                                                </span>
                                            </h2>
                                        </div>
                                        <p>{parse(decode(body_html))}</p>
                                        <div className="comment-info">
                                            <i class="fas fa-arrow-up" title="Upvote"></i>
                                            <i class="fas fa-arrow-down" title="Downvote"></i>
                                            <span id="votes">{ups > 999 ? `${(ups / 1000).toFixed(1)}k` : ups}</span>
                                        </div>

                                        {!replies.data ? '' :
                                            replies.data.children.length <= 1 ? '' :
                                                replies.data.children.slice(0, replies.data.children.length - 1).map(reply => {
                                                    //Object destructuring
                                                    const { kind: r_kind, data: { 
                                                        author: r_author, author_flair_richtext: r_author_flair_richtext, body_html: r_body_html, collapsed: r_collapsed, created_utc: r_created_utc, is_submitter: r_is_submitter, replies: r_replies, ups: r_ups 
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
                                                                    <h2 
                                                                    className="username" 
                                                                    onClick={() => { this.toggleSecondHidden(comment, reply) }}
                                                                    style={r_is_submitter === true ? {color: "dodgerblue"} : {color: "black"}}
                                                                    title={r_is_submitter === true ? 'This user is the Original Poster' : ''}>
                                                                        u/{r_author}
                                                                        <span id="comment-time">
                                                                            ~ {dayjs(dayjs.unix(r_created_utc)).fromNow()}
                                                                        </span>
                                                                    </h2>
                                                                </div>
                                                                <p>{parse(decode(r_body_html))}</p>
                                                                <div className="comment-info">
                                                                    <i class="fas fa-arrow-up" title="Upvote"></i>
                                                                    <i class="fas fa-arrow-down" title="Downvote"></i>
                                                                    <span id="votes">{r_ups > 999 ? `${(r_ups / 1000).toFixed(1)}k` : r_ups}</span>
                                                                </div>
                                                                {!r_replies.data ? '' :
                                                                    r_replies.data.children.length <= 1 ? '' :
                                                                        r_replies.data.children.slice(0, r_replies.data.children.length - 1).map(secondLayer => {
                                                                            //Object destructuring
                                                                            const { kind: s_kind, data: { 
                                                                                author: s_author, author_flair_richtext: s_author_flair_richtext, body_html: s_body_html, created_utc: s_created_utc, is_submitter: s_is_submitter, ups: s_ups
                                                                            }} = secondLayer;
                                                                            //Does Author have a flair?
                                                                            let sLayerFlair = this.flairExists(s_kind, s_author_flair_richtext);
                                                                            return (
                                                                                //Ensure the reply kind is not 'more'
                                                                                s_kind === 'more' ? '' :
                                                                                <div className="second-reply-layer">
                                                                                    <div className="author">
                                                                                        {sLayerFlair}
                                                                                        <h2 
                                                                                        className="username"
                                                                                        style={s_is_submitter === true ? {color: "dodgerblue"} : {color: "black"}}
                                                                                        title={s_is_submitter === true ? 'This user is the Original Poster' : ''}>
                                                                                            u/{s_author}
                                                                                            <span id="comment-time">
                                                                                                ~ {dayjs(dayjs.unix(s_created_utc)).fromNow()}
                                                                                            </span>
                                                                                        </h2>
                                                                                    </div>
                                                                                    <p>{parse(decode(s_body_html))}</p>
                                                                                    <div className="comment-info">
                                                                                        <i class="fas fa-arrow-up" title="Upvote"></i>
                                                                                        <i class="fas fa-arrow-down" title="Downvote"></i>
                                                                                        <span id="votes">{s_ups > 999 ? `${(s_ups / 1000).toFixed(1)}k` : s_ups}</span>
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