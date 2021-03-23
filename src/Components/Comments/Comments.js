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
        this.getCommentJSX = this.getCommentJSX.bind(this);
    }

    //Fetch the comments of a post
    async commentsFetch(sort = '?sort=confidence') {
        let str = this.props.rp.location.pathname;
        str = str.substring(9, str.length)
        const response = await fetch(`https://www.reddit.com${str}.json${sort}`);
        const jsonResponse = await response.json();
        this.setState({
            post: jsonResponse[0].data.children,
            comments: jsonResponse[1].data.children,
            sort: sort
        })

        //Update post with updated data
        this.props.updatePost(jsonResponse[0].data.children[0]);
    }

    //Toggle the collapsed value of a comment
    toggleFirstHidden(toggle) {
        toggle.data.collapsed = !toggle.data.collapsed;

        this.setState(prevState => ({
            comments: prevState.comments.map(
                comment => comment.data.id === toggle.data.id ? toggle : comment
            )
        }));
    }

    //Toggle the collapsed property of a reply
    toggleSecondHidden(comment, reply) {
        let replyIndex = comment.data.replies.data.children.indexOf(reply);
        comment.data.replies.data.children[replyIndex].data.collapsed = !comment.data.replies.data.children[replyIndex].data.collapsed;

        this.setState(prevState => ({
            comments: prevState.comments.map(
                c => c.data.id === comment.data.id ? comment : c
            )
        }));
    }

    //Check if the author has a flair
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

    //Generate JSX for comment items
    getCommentJSX(comment) {
        //Object destructuring
        const { kind, data: { author, author_flair_richtext, body_html, created_utc, id, is_submitter, ups } } = comment;
        //Does Author have a flair?                       
        let commentFlair = this.flairExists(kind, author_flair_richtext);

        return [
            <div className="author">
                {commentFlair}
                <h2
                    className="username"
                    onClick={() => { this.toggleFirstHidden(comment) }}
                    style={is_submitter === true ? { color: "dodgerblue" } : { color: "black" }}
                    title={is_submitter === true ? 'This user is the Original Poster' : ''}>
                    u/{author}
                    <span id="comment-time">
                        ~ {dayjs(dayjs.unix(created_utc)).fromNow()}
                    </span>
                </h2>
            </div>,
            <p>{parse(decode(body_html))}</p>,
            <div className="comment-info">
                <i 
                    id={'u-' + id} 
                    className="fas fa-arrow-up" 
                    title="Upvote"
                    onClick={({ target: { id } }) => {
                        let up = document.getElementById('u-' + id.split("-")[1]);
                        let down = document.getElementById('d-' + id.split("-")[1]);
                        let votes = document.getElementById('v-' + id.split("-")[1]);
                        up.style.color === '' ? up.style.color = 'goldenrod' : up.style.color = '';
                        down.style.color = '';
                        up.style.color === 'goldenrod' ? votes.style.color = 'goldenrod' : votes.style.color = '';
                    }}>
                </i>
                <i 
                    id={'d-' + id} 
                    className="fas fa-arrow-down" 
                    title="Downvote"
                    onClick={({ target: { id } }) => {
                        let up = document.getElementById('u-' + id.split("-")[1]);
                        let down = document.getElementById('d-' + id.split("-")[1]);
                        let votes = document.getElementById('v-' + id.split("-")[1]);
                        down.style.color === '' ? down.style.color = 'red' : down.style.color = '';
                        up.style.color = '';
                        down.style.color === 'red' ? votes.style.color = 'red' : votes.style.color = '';
                    }}>
                </i>
                <span id={'v-' + id} className="votes">{ups > 999 ? `${(ups / 1000).toFixed(1)}k` : ups}</span>
            </div>  
        ];
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
                {/* The Post */}
                {this.state.post.map((post, i) => {
                    return <div key={'Post-' + i} className="post-divider">{this.props.displayPost(post)}</div>;
                })}

                {/* Comment Navigation Options */}
                <div className="comment-navigation">
                    <Link to="/" onClick={() => {setTimeout(() => this.props.setScrollPosition(), 0)}}>
                        <i class="fas fa-chevron-left" title="Go Back"></i>
                    </Link>
                    <div className="sort-comments">
                        <span id="label">Sorted by</span>
                        <div id="current-sort">
                            {this.state.sort === '?sort=confidence' ? 'HOT' : this.state.sort === '?sort=top' ? 'TOP' : this.state.sort === '?sort=new' ? 'NEW' : ''}
                            <i class="fas fa-sort-down"></i>
                            <div className="sort-menu">
                                <button title="Sort Comments by Hot" onClick={() => this.commentsFetch('?sort=confidence')}>
                                    <i
                                        className="fas fa-fire-alt sort"
                                        style={this.state.sort === '?sort=confidence' ? { color: 'dodgerblue' } : { color: 'rgb(190, 190, 190)' }}>
                                        <span>Hot</span>
                                    </i>
                                </button>
                                <button title="Sort Comments by Top" onClick={() => this.commentsFetch('?sort=top')}>
                                    <i
                                        className="fas fa-medal sort"
                                        style={this.state.sort === '?sort=top' ? { color: 'dodgerblue' } : { color: 'rgb(190, 190, 190)' }}>
                                        <span>Top</span>
                                    </i>
                                </button>
                                <button title="Sort Comments by New" onClick={() => this.commentsFetch('?sort=new')}>
                                    <i
                                        className="fas fa-certificate sort"
                                        style={this.state.sort === '?sort=new' ? { color: 'dodgerblue' } : { color: 'rgb(190, 190, 190)' }}>
                                        <span>New</span>
                                    </i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <section className="comments-container">
                    {this.state.comments.map(comment => {
                        const { kind, data: { author, collapsed, id, replies, is_submitter } } = comment;
                        return (
                            //Check that type isn't 'more', and collapsed status
                            kind === 'more' ? '' :
                            collapsed === false ?
                                <div className="comment-item" key={id}>
                                    {/* Pass each comment to JSX generator */}
                                    {this.getCommentJSX(comment).map(el => el)}

                                    {/* Are there any replies? */}
                                    {!replies.data ? '' :
                                    replies.data.children.length <= 1 ? '' :
                                    replies.data.children.slice(0, replies.data.children.length - 1).map(reply => {

                                        //Object destructuring
                                        const { kind: r_kind, data: { author: r_author, collapsed: r_collapsed, id: r_id, is_submitter: r_is_submitter, replies: r_replies} } = reply;
                                        return (
                                            //Check that type isn't 'more', and collapsed status
                                            r_kind === 'more' ? '' :
                                            r_collapsed === false ?
                                                <div className="first-reply-layer" key={r_id}>
                                                    {/* Pass each reply to JSX generator */}
                                                    {this.getCommentJSX(reply).map(el => el)}

                                                    {/* Are there any replies? */}
                                                    {!r_replies.data ? '' :
                                                    r_replies.data.children.length <= 1 ? '' :
                                                    r_replies.data.children.slice(0, r_replies.data.children.length - 1).map(secondLayer => {

                                                        //Object destructuring
                                                        const { kind: s_kind, id: s_id } = secondLayer;
                                                        return (
                                                            //Ensure the reply kind is not 'more'
                                                            s_kind === 'more' ? '' :
                                                                <div className="second-reply-layer" key={s_id}>
                                                                    {/* Pass each reply to JSX generator */}
                                                                    {this.getCommentJSX(secondLayer)}
                                                                </div>
                                                        );
                                                    })}
                                                </div> :
                                                //If the collapsed property is set to true, hide the reply and its children
                                                <div className="first-reply-layer" key={r_id} onClick={() => { this.toggleSecondHidden(comment, reply) }}>
                                                    <h2
                                                    className="username"
                                                    style={r_is_submitter === true ? { color: "dodgerblue" } : { color: "black" }}
                                                    title={r_is_submitter === true ? 'This user is the Original Poster' : ''}>
                                                        u/{r_author}
                                                    </h2>
                                                    <p>...</p>
                                                </div>
                                        );
                                    })}
                                </div> :
                                //If the collapsed property is set to true, hide the comment and its children
                                <div className="comment-item" key={id}>
                                    <h2
                                    className="username"
                                    style={is_submitter === true ? { color: "dodgerblue" } : { color: "black" }}
                                    title={is_submitter === true ? 'This user is the Original Poster' : ''}
                                    onClick={() => { this.toggleFirstHidden(comment) }}>
                                        u/{author}
                                    </h2>
                                    <p>...</p>
                                </div>
                        );
                    })}
                </section>
            </div>
        );
    }
};