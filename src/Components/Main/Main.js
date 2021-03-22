import React from 'react';
import { Switch, Route, Link } from "react-router-dom";
import { Comments } from '../Comments/Comments';
import { decode } from 'html-entities';
import parse from 'html-react-parser';
import * as dayjs from 'dayjs';
import defaultImg from '../../Icons/popular.webp';
//For embedding content
import TweetEmbed from 'react-tweet-embed'
import ReactPlayer from 'react-player/lazy';

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.displayPost = this.displayPost.bind(this);
        this.formatPost = this.formatPost.bind(this);
    }

    displayPost(post, i) {
        const { data: { all_awardings, author, author_flair_richtext, created_utc, num_comments, permalink, subreddit, subreddit_id, ups } } = post;

        //Does Author have a flair?
        let flair = author_flair_richtext ? author_flair_richtext.length > 0 ? author_flair_richtext[0].u ?
            <img src={author_flair_richtext[0].u} alt="Author's flair" title={author_flair_richtext[0].a} />
            : ''
            : ''
            : '';

        //Retrieve image src and title for the subreddit's info
        const icon = this.props.about.filter(el => el.name === subreddit_id);
        let src = icon[0] ? icon[0].icon_img !== "" && icon[0].icon_img !== null ? icon[0].icon_img : defaultImg : defaultImg;
        let title = icon[0] ? icon[0].title !== "" && icon[0].title !== null ? icon[0].title : { subreddit } : { subreddit };

        //Save JSX returned from the formatPost function
        const postOutput = this.formatPost(post, i);

        return (
            <div className="post-divider">
                <div className="sub-image">
                    <img
                        src={src}
                        alt={subreddit}
                        title={title}
                    />
                </div>
                <article className="reddit-post" key={i}>
                    <Link to="/">
                        <div className="post-flex-item sub">
                            <div
                                className="subreddit-data"
                                onClick={() => {
                                    this.props.fetchPosts({
                                        query: `r/${subreddit}.json`,
                                        active: subreddit
                                    })
                                }}
                            >
                                <h3 title={title}>r/{subreddit}</h3>

                                {all_awardings.length > 0 ?
                                    <div className="awards-container">
                                        {all_awardings.map(({ icon_url, name, description, count }) => {
                                            return <div className="award" key={name}><img src={icon_url} alt={name} title={`${name}\n${description}`} />x{count}</div>
                                        })}
                                    </div>
                                    : ''}
                            </div>
                        </div>
                    </Link>
                    {postOutput}
                    <div className="post-flex-item options">
                        <div className="voting-buttons">
                            <div className="upvote">
                                <i
                                    id={'h-' + i}
                                    className="bi bi-heart"
                                    title="Upvote"
                                    onClick={({ target: { id } }) => {
                                        let fill = document.getElementById('hFill-' + id.split("-")[1]);
                                        let xfill = document.getElementById('xFill-' + id.split("-")[1]);
                                        fill.style.color === '' ? fill.style.color = 'gold' : fill.style.color = '';
                                        xfill.style.color = '';
                                    }}
                                >
                                </i>
                                <i id={'hFill-' + i} className="bi bi-heart-fill"></i>
                            </div>
                            <div className="downvote">
                                <i
                                    id={'x-' + i}
                                    class="bi bi-x-circle"
                                    title="Downvote"
                                    onClick={({ target: { id } }) => {
                                        let fill = document.getElementById('xFill-' + id.split("-")[1]);
                                        let hfill = document.getElementById('hFill-' + id.split("-")[1]);
                                        fill.style.color === '' ? fill.style.color = 'lightcoral' : fill.style.color = '';
                                        hfill.style.color = '';
                                    }}
                                >
                                </i>
                                <i id={'xFill-' + i} class="bi bi-x-circle-fill"></i>
                            </div>
                            <span className="votes">{ups > 999 ? `${(ups / 1000).toFixed(1)}k` : ups}</span>
                        </div>
                        <Link
                            to={`/Comments${[permalink]}`} id="comments" onClick={() => this.props.saveScrollPosition()}>
                            <div className="comment-icons">
                                <i className="bi bi-chat-left" title="Comments"></i>
                                <i className="bi bi-chat-left-fill" title="Comments"></i>
                            </div>
                            <span id="num-comments">{num_comments > 999 ? `${(num_comments / 1000).toFixed(1)}k Comments` : `${num_comments} Comments`}</span>
                        </Link>
                        <span id="posted-by">Posted by: {flair}<span id="retro">{author}</span> ~ {dayjs(dayjs.unix(created_utc)).fromNow()}</span>
                    </div>
                </article>
            </div>
        );
    }

    //Based on post type, display it in a certain way
    formatPost(post, i) {

        let output;
        let flex = 'column';
        let ac = 'flex-start';

        let { data, data: { domain, selftext, title, url } } = post;
        title = decode(title);

        //Reusable JSX
        const titleLink =
            <a className="title link" href={url} target="_blank" rel="noreferrer">
                {title}
            </a>;

        //Switch post_hint property
        switch (data.post_hint) {
            //Link
            case 'link':
                switch (domain) {
                    case 'gfycat.com':
                        if (data.media_embed.content) {
                            output = [
                                titleLink,
                                <div className="media">
                                    {parse(decode(data.media_embed.content))}
                                </div>
                            ];
                        } else {
                            output = [
                                titleLink,
                                <div className="media">
                                    <ReactPlayer controls="true" width="1040px" height="590px" url={data.preview.reddit_video_preview.fallback_url} />
                                </div>
                            ];
                        }
                        break;
                    case 'i.imgur.com':
                    case 'imgur.com':
                        if (data.preview.reddit_video_preview) {
                            output = [
                                titleLink,
                                <div className="media">
                                    <ReactPlayer controls="true" width="1040px" height="590px" url={data.preview.reddit_video_preview.fallback_url} />
                                </div>
                            ];
                        } else {
                            output = [
                                titleLink,
                                <div className="media">
                                    <img className="thumbnail" src={data.thumbnail} alt={title} />
                                </div>
                            ];
                        }
                        break;
                    case 'vimeo':
                    case 'streamable.com':
                        output = [
                            titleLink,
                            <div className="media">
                                <ReactPlayer controls="true" width="1040px" height="590px" url={url} />
                            </div>
                        ];
                        break;
                    default:
                        if (data.thumbnail === 'default') {
                            output = [
                                <a className="title link oneliner" href={url} target="_blank" rel="noreferrer">
                                    {title}
                                </a>
                            ];
                        } else {
                            output = [
                                titleLink,
                                <div className="media">
                                    <img className="thumbnail" src={data.thumbnail} alt={title} />
                                </div>
                            ];
                        }
                }
                break;
            //Image
            case 'image':
                output = [
                    titleLink,
                    <div id={'media' + url} className="media">
                        <img
                            className="image"
                            src={url}
                            alt={title}
                            onLoad={({ target: { offsetHeight: h, offsetWidth: w } }) => {
                                flex = h > w ? 'row' : 'column';
                                ac = h > w ? 'center' : 'flex-start';
                                document.getElementById(url).style.flexDirection = flex;
                                document.getElementById('media' + url).style.justifyContent = ac;
                            }} />
                    </div>
                ];
                break;
            //Hosted Video
            case 'hosted:video':
                output = [
                    titleLink,
                    <div className="media">
                        <ReactPlayer controls="true" width="1040px" height="590px" url={data.secure_media.reddit_video.fallback_url} />
                    </div>
                ];
                break;
            //Rich Video
            case 'rich:video':
                switch (domain) {
                    case 'youtube.com':
                    case 'youtu.be':
                    case 'vimeo':
                    case 'streamable.com':
                        output = [
                            titleLink,
                            <div className="media">
                                <ReactPlayer controls="true" width="1040px" height="590px" url={url} />
                            </div>
                        ];
                        break;
                    case 'gfycat.com':
                        output = [
                            titleLink,
                            <div className="media">
                                {parse(decode(data.media_embed.content))}
                            </div>
                        ];
                        break;
                    default:
                        output = [
                            titleLink,
                            <div className="media">
                                <ReactPlayer controls="true" width="1040px" height="590px" url={url} />
                            </div>
                        ];
                }
                break;
            //Undefined
            case undefined:
                if (selftext !== "") {
                    if (data.selftext.length < 2500) {
                        output = [
                            titleLink,
                            <div className="text" >
                                {parse(decode(data.selftext_html))}
                            </div>
                        ];
                    } else {
                        output = [
                            titleLink,
                            <div id={`long-${i}`} className="long">
                                <div id={`readmore-${i}`} className="readmore"></div>
                                <button
                                    id={`expand-${i}`}
                                    className="read"
                                    title="Expand the Post"
                                    style={{ display: 'block' }}
                                    onClick={({ target: { id } }) => {
                                        let num = id.split("-")[1];
                                        document.getElementById(`long-${num}`).style.maxHeight === '100%' ? document.getElementById(`long-${num}`).style.maxHeight = '300px' : document.getElementById(`long-${num}`).style.maxHeight = '100%';
                                        document.getElementById(`readmore-${num}`).style.display === 'none' ? document.getElementById(`readmore-${num}`).style.display = 'block' : document.getElementById(`readmore-${num}`).style.display = 'none';
                                        document.getElementById(`expand-${num}`).style.display === 'block' ? document.getElementById(`expand-${num}`).style.display = 'none' : document.getElementById(`expand-${num}`).style.display = 'block';
                                        document.getElementById(`collapse-${num}`).style.display === 'block' ? document.getElementById(`collapse-${num}`).style.display = 'none' : document.getElementById(`collapse-${num}`).style.display = 'block';
                                    }}>
                                    Show More
                                </button>
                                <button
                                    id={`collapse-${i}`}
                                    className="read"
                                    title="Collapse the Post"
                                    style={{ display: 'none' }}
                                    onClick={({ target: { id } }) => {
                                        let num = id.split("-")[1];
                                        document.getElementById(`long-${num}`).style.maxHeight === '100%' ? document.getElementById(`long-${num}`).style.maxHeight = '300px' : document.getElementById(`long-${num}`).style.maxHeight = '100%';
                                        document.getElementById(`readmore-${num}`).style.display === 'none' ? document.getElementById(`readmore-${num}`).style.display = 'block' : document.getElementById(`readmore-${num}`).style.display = 'none';
                                        document.getElementById(`expand-${num}`).style.display === 'block' ? document.getElementById(`expand-${num}`).style.display = 'none' : document.getElementById(`expand-${num}`).style.display = 'block';
                                        document.getElementById(`collapse-${num}`).style.display === 'block' ? document.getElementById(`collapse-${num}`).style.display = 'none' : document.getElementById(`collapse-${num}`).style.display = 'block';
                                    }}>
                                    Show Less
                                </button>
                                {parse(decode(data.selftext_html))}
                            </div>
                        ];
                    }
                    break;
                } else if (!domain.startsWith("self")) {
                    switch (domain) {
                        case 'twitter.com':
                            flex = 'row';
                            output = [
                                titleLink,
                                <div className="media">
                                    <TweetEmbed id={url.split("/")[5].split("?")[0]} />
                                </div>
                            ];
                            break;
                        case 'v.redd.it':
                            if (data.media) {
                                output = [
                                    titleLink,
                                    <div className="media">
                                        <ReactPlayer controls="true" width="1040px" height="590px" url={data.secure_media.reddit_video.fallback_url} />
                                    </div>
                                ];
                            } else {
                                output = [titleLink];
                            }
                            break;
                        case 'youtube.com':
                        case 'youtu.be':
                        case 'vimeo':
                        case 'streamable.com':
                        case 'streamye.com':
                        case 'streamja.com':
                        case 'streamwo.com':
                            output = [
                                titleLink,
                                <div className="media">
                                    <ReactPlayer controls="true" width="1040px" height="590px" url={url} />
                                </div>
                            ];
                            break;
                        case 'i.redd.it':
                            output = [
                                titleLink,
                                <div className="media">
                                    <img className="image" src={url} alt={title} />
                                </div>
                            ];
                            break;
                        default:
                            data.thumbnail === 'default' || data.thumbnail === "" ?
                                output = [
                                    <a className="title link oneliner" href={url} target="_blank" rel="noreferrer">
                                        {title}
                                    </a>
                                ] :
                                output = [
                                    <a className="title link" href={url} target="_blank" rel="noreferrer">
                                        {title}
                                    </a>,
                                    <div className="media">
                                        <img className="thumbnail" src={data.thumbnail} alt={title} />
                                    </div>
                                ];
                            break;
                    }
                } else {
                    output = [
                        <h1 className="title oneliner">{title}</h1>
                    ];
                }
                break;
            default:
                output = [titleLink];
                break;
        }
        return (
            <div
                key={url}
                className="post-flex-item content"
                id={url}
                style={{ flexDirection: flex }}
            >
                {output}
            </div>
        );
    }

    render() {
        const relativeTime = require('dayjs/plugin/relativeTime');
        dayjs.extend(relativeTime);
        return (
            <main>
                <Switch>
                    <Route path="/" exact>
                        <div id="posts">
                            {this.props.posts.map((post, i) => {
                                return this.displayPost(post, i)
                            })}
                        </div>
                    </Route>
                    <Route path="/Comments/:id" render={routeProps =>
                        <Comments
                            rp={routeProps}
                            displayPost={this.displayPost}
                            setScrollPosition={this.props.setScrollPosition}
                            updatePost={this.props.updatePost}
                        />
                    } />
                </Switch>
            </main>
        );
    }
};