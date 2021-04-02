import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { decode } from 'html-entities';
import parse from 'html-react-parser';
import * as dayjs from 'dayjs';

export const Comments = ({ displayPost, rp, setScrollPosition, updatePost }) => {

    const [post, setPost] = useState([]);
    const [comments, setComments] = useState([]);
    const [sort, setSort] = useState('?sort=confidence');
    const [loading, setLoading] = useState(true);

    async function commentsFetch(view = '?sort=confidence') {
        setLoading(true);
        let str = rp.location.pathname;
        str = str.substring(9, str.length)
        const response = await fetch(`https://www.reddit.com${str}.json${view}`);
        const jsonResponse = await response.json();

        setPost(jsonResponse[0].data.children);
        setComments(jsonResponse[1].data.children);
        setSort(view);
        setLoading(false);

        updatePost(jsonResponse[0].data.children[0]);
    }

    function toggleFirstHidden(toggle) {
        toggle.data.collapsed = !toggle.data.collapsed;
        setComments(comments.map(c => c.data.id === toggle.data.id ? toggle : c));
    }

    function toggleSecondHidden(comment, reply) {
        let replyIndex = comment.data.replies.data.children.indexOf(reply);
        comment.data.replies.data.children[replyIndex].data.collapsed = !comment.data.replies.data.children[replyIndex].data.collapsed;
        setComments(comments.map(c => c.data.id === comment.data.id ? comment : c));
    }

    function flairExists(kind, flair) {
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

    function getCommentHead(comment) {
        const { kind, data: { all_awardings, author, author_flair_richtext, created_utc, is_submitter } } = comment;
        //Does Author have a flair?                       
        let commentFlair = flairExists(kind, author_flair_richtext);
        return (
            <div className="author">
                {commentFlair}
                <h2
                    className="username"
                    onClick={() => toggleFirstHidden(comment)}
                    style={is_submitter ? { color: "dodgerblue" } : { color: "black" }}
                    title={is_submitter ? 'This user is the Original Poster' : ''}>
                    u/{author}
                    <span id="comment-time">
                        ~ {dayjs(dayjs.unix(created_utc)).fromNow()}
                    </span>
                </h2>
                {all_awardings.length > 0 ?
                    <div className="awards-container-comment">
                        {all_awardings.map(({ icon_url, name, description, count }) => {
                            return <div className="award-comment" key={name}><img src={icon_url} alt={name} title={`${name}\n${description}`} />x{count}</div>
                        })}
                    </div>
                    : ''}
            </div>
        );
    }

    function getCommentBody(body) {
        return <p>{parse(decode(body))}</p>;
    }

    function getCommentTail(id, ups) {
        return (
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
        );
    }

    function getCommentJSX(comment) {
        const { data: { body_html, id, ups } } = comment;
        const head = getCommentHead(comment);
        const body = getCommentBody(body_html);
        const tail = getCommentTail(id, ups);
        return [head, body, tail];
    }

    //Returns Array of Replies if validation is met
    function checkReplies(replies) {
        if (replies?.data?.children?.length > 1) {
            return replies.data.children.slice(0, replies.data.children.length - 1);
        }
    }

    useEffect(() => {
        commentsFetch();
        window.scrollTo(0, 0);
    }, []);

    const relativeTime = require('dayjs/plugin/relativeTime')
    dayjs.extend(relativeTime)
    return (
        <div id="posts">

            {/* Loading... */}
            {loading &&
                <div class="preloader-1">
                    <div className="loading">Loading</div>
                    <div id="loading-container">
                        <span class="line line-1"></span>
                        <span class="line line-2"></span>
                        <span class="line line-3"></span>
                        <span class="line line-4"></span>
                        <span class="line line-5"></span>
                        <span class="line line-6"></span>
                        <span class="line line-7"></span>
                        <span class="line line-8"></span>
                        <span class="line line-9"></span>
                    </div>
                </div>}

            {/* The Post */}
            {post.map((post, i) => {
                return <div key={'Post-' + i} className="post-divider">{displayPost(post)}</div>;
            })}

            {/* Comment Sort Options */}
            <div className="comment-navigation">
                <Link to="/" onClick={() => setTimeout(() => setScrollPosition(), 0)}>
                    <i class="fas fa-chevron-left" title="Go Back"></i>
                </Link>
                <div className="sort-comments">
                    <span id="label">Sorted by</span>
                    <div id="current-sort">
                        {sort === '?sort=confidence' ? 'HOT' : sort === '?sort=top' ? 'TOP' : sort === '?sort=new' ? 'NEW' : ''}
                        <i class="fas fa-sort-down"></i>

                        <div className="sort-menu">
                            {/* option HOT */}
                            <button title="Sort Comments by Hot" onClick={() => commentsFetch('?sort=confidence')}>
                                <i
                                    className="fas fa-fire-alt sort"
                                    style={sort === '?sort=confidence' ? { color: 'dodgerblue' } : { color: 'rgb(160, 160, 160)' }}>
                                    <span>Hot</span>
                                </i>
                            </button>
                            {/* option TOP */}
                            <button title="Sort Comments by Top" onClick={() => commentsFetch('?sort=top')}>
                                <i
                                    className="fas fa-medal sort"
                                    style={sort === '?sort=top' ? { color: 'dodgerblue' } : { color: 'rgb(160, 160, 160)' }}>
                                    <span>Top</span>
                                </i>
                            </button>
                            {/* option NEW */}
                            <button title="Sort Comments by New" onClick={() => commentsFetch('?sort=new')}>
                                <i
                                    className="fas fa-certificate sort"
                                    style={sort === '?sort=new' ? { color: 'dodgerblue' } : { color: 'rgb(160, 160, 160)' }}>
                                    <span>New</span>
                                </i>
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <section className="comments-container">
                {comments.map(comment => {
                    const { kind, data: { author, collapsed, id, replies, is_submitter } } = comment;
                    return (
                        kind === 'more' ? '' :
                            collapsed === false ?
                                <div className="comment-item" key={id} >
                                    {getCommentJSX(comment).map(el => el)}

                                    {/* Are there any replies? */}
                                    {!checkReplies(replies) ? '' : checkReplies(replies).map(reply => {
                                        const { kind, data: { author, collapsed, id, is_submitter, replies } } = reply;
                                        return (
                                            kind === 'more' ? '' :
                                                collapsed === false ?
                                                    <div className="first-reply-layer" key={id}>
                                                        {getCommentJSX(reply).map(el => el)}

                                                        {/* Are there any replies? */}
                                                        {!checkReplies(replies) ? '' : checkReplies(replies).map(secondLayer => {
                                                            const { kind, id } = secondLayer;
                                                            return (
                                                                kind === 'more' ? '' :
                                                                    <div className="second-reply-layer" key={id}>
                                                                        {getCommentJSX(secondLayer)}
                                                                    </div>
                                                            );
                                                        })}
                                                    </div> :
                                                    <div className="first-reply-layer" key={id} onClick={() => toggleSecondHidden(comment, reply)}>
                                                        <h2
                                                            className="username"
                                                            style={is_submitter === true ? { color: "dodgerblue" } : { color: "black" }}
                                                            title={is_submitter === true ? 'This user is the Original Poster' : ''}>
                                                            u/{author}
                                                        </h2>
                                                        <p>...</p>
                                                    </div>
                                        );
                                    })}
                                </div> :
                                <div className="comment-item" key={id}>
                                    <h2
                                        className="username"
                                        style={is_submitter === true ? { color: "dodgerblue" } : { color: "black" }}
                                        title={is_submitter === true ? 'This user is the Original Poster' : ''}
                                        onClick={() => toggleFirstHidden(comment)}>
                                        u/{author}
                                    </h2>
                                    <p>...</p>
                                </div>
                    );
                })}
            </section>
        </div>
    );
};