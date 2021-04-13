import { useRef, useCallback } from 'react';
import { Switch, Route, Link } from "react-router-dom";
import { Comments } from '../Comments/Comments';
import { decode } from 'html-entities';
import parse from 'html-react-parser';
import dayjs from 'dayjs';
import defaultImg from '../../Icons/popular.webp';
//For embedding content
import TweetEmbed from 'react-tweet-embed'
import ReactPlayer from 'react-player/lazy';

export const Main = ({ about, activeSubreddit, after, displayNumber, fetchPosts, hasMore, increaseDisplay, loading, posts, saveScrollPosition, setScrollPosition, updatePost, view }) => {

    let postsToDisplay = posts.slice(0, displayNumber);

    const observer = useRef();
    const lastPostElement = useCallback(node => {
        if (loading) return;
        if (observer.current) observer.current.disconnect();
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                if ((displayNumber + 10) <= posts.length) return increaseDisplay(10);
                fetchPosts({
                    query: `r/${activeSubreddit}/${view}/.json?after=${after}`,
                    active: activeSubreddit,
                    view,
                    displayNum: displayNumber + 10,
                    more: true
                });
            }
        });
        if (node) observer.current.observe(node);
    }, [loading, hasMore, activeSubreddit, view, displayNumber]);

    const displayPost = (post, i) => {
        const { data: { all_awardings, author, author_flair_richtext, created_utc, num_comments, permalink, subreddit, subreddit_id, ups } } = post;

        //Does Author have a flair?
        let flairImg = author_flair_richtext?.[0]?.u;
        let flair = flairImg === undefined ? '' : <img src={flairImg} alt="Author's flair" title={author_flair_richtext[0].a} />;

        //Retrieve image src and title for the subreddit's info
        const icon = about.filter(el => el.name === subreddit_id);
        let src = icon?.[0]?.icon_img || defaultImg;
        let title = icon?.[0]?.title || subreddit;
        return (
            <>
                <div className="sub-image">
                    <img src={src} alt={subreddit} title={title} />
                </div>
                <article className="reddit-post" key={i}>
                    <div className="post-flex-item sub">
                        <div className="subreddit-data">
                            <Link to="/"><h3 title={title} onClick={() => fetchPosts({ query: `r/${subreddit}.json`, active: subreddit })}>r/{subreddit}</h3></Link>
                            {all_awardings.length > 0 ?
                                <div className="awards-container">
                                    {all_awardings.map(({ icon_url, name, description, count }) => {
                                        return <div className="award" key={name}><img src={icon_url} alt={name} title={`${name}\n${description}`} />x{count}</div>
                                    })}
                                </div>
                                : ''}
                        </div>
                    </div>
                    {formatPost(post, i)}
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
                            to={`/Comments${[permalink]}`} id="comments" onClick={() => saveScrollPosition()}>
                            <div className="comment-icons">
                                <i className="bi bi-chat-left" title="Comments"></i>
                                <i className="bi bi-chat-left-fill" title="Comments"></i>
                            </div>
                            <span id="num-comments">{num_comments > 999 ? `${(num_comments / 1000).toFixed(1)}k Comments` : `${num_comments} Comments`}</span>
                        </Link>
                        <span id="posted-by">Posted by: {flair}<span id="retro">{author}</span> ~ {dayjs(dayjs.unix(created_utc)).fromNow()}</span>
                    </div>
                </article>
            </>
        );
    }

    const formatPost = (post, i) => {
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

        switch (data.post_hint) {
            //Link
            case 'link':
                switch (domain) {
                    case 'gfycat.com':
                        output = data.media_embed.content ?
                            [
                                titleLink,
                                <div className="media">
                                    {parse(decode(data.media_embed.content))}
                                </div>
                            ] :
                            [
                                titleLink,
                                <div className="player-wrapper">
                                    <ReactPlayer className='react-player' controls width='100%' height='100%' url={data.preview.reddit_video_preview.fallback_url} />
                                </div>
                            ];
                        break;
                    case 'i.imgur.com':
                    case 'imgur.com':
                        output = data.preview.reddit_video_preview ?
                            [
                                titleLink,
                                <div className="player-wrapper">
                                    <ReactPlayer className='react-player' controls width='100%' height='100%' url={data.preview.reddit_video_preview.fallback_url} />
                                </div>
                            ] :
                            [
                                titleLink,
                                <div className="media">
                                    <img className="thumbnail" src={data.thumbnail} alt={title} />
                                </div>
                            ];
                        break;
                    case 'vimeo':
                    case 'streamable.com':
                        output = [
                            titleLink,
                            <div className="player-wrapper">
                                <ReactPlayer className='react-player' controls width='100%' height='100%' url={url} />
                            </div>
                        ];
                        break;
                    default:
                        output = data.thumbnail === 'default' ?
                            [
                                <a className="title link oneliner" href={url} target="_blank" rel="noreferrer">
                                    {title}
                                </a>
                            ] :
                            [
                                titleLink,
                                <div className="media">
                                    <img className="thumbnail" src={data.thumbnail} alt={title} />
                                </div>
                            ];
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
                                if (matchMedia) {
                                    if (window.matchMedia("(max-width: 800px)").matches) {
                                        flex = 'column';
                                        ac = 'flex-start';
                                    }  
                                }
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
                    <div className="player-wrapper">
                        <ReactPlayer className='react-player' controls width='100%' height='100%' url={data.secure_media.reddit_video.fallback_url} />
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
                            <div className="player-wrapper">
                                <ReactPlayer className='react-player' controls width='100%' height='100%' url={url} />
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
                            <div className="player-wrapper">
                                <ReactPlayer className='react-player' controls width='100%' height='100%' url={url} />
                            </div>
                        ];
                }
                break;
            //Undefined
            case undefined:
                if (selftext !== "") {
                    output = data.selftext.length < 2500 ?
                        [
                            titleLink,
                            <div className="text" >
                                {parse(decode(data.selftext_html))}
                            </div>
                        ] :
                        [
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
                            output = data.media ?
                                [
                                    titleLink,
                                    <div className="player-wrapper">
                                        <ReactPlayer className='react-player' controls width='100%' height='100%' url={data.secure_media.reddit_video.fallback_url} />
                                    </div>
                                ] :
                                [titleLink];
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
                                <div className="player-wrapper">
                                    <ReactPlayer className='react-player' controls width='100%' height='100%' url={url} />
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
                            output = data.thumbnail === 'default' || data.thumbnail === "" ?
                                [
                                    <a className="title link oneliner" href={url} target="_blank" rel="noreferrer">
                                        {title}
                                    </a>
                                ] :
                                [
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
            <div key={url} className="post-flex-item content" id={url} style={{ flexDirection: flex }}>
                {output}
            </div>
        );
    }

    const relativeTime = require('dayjs/plugin/relativeTime');
    dayjs.extend(relativeTime);
    return (
        <main>
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
            <Switch>
                <Route path="/" exact>
                    <div id="posts">
                        {postsToDisplay.map((post, i) => {
                            if (postsToDisplay.length === i + 1) {
                                return <div ref={lastPostElement} key={'Post-' + i} className="post-divider">{displayPost(post, i)}</div>
                            } else {
                                return <div key={'Post-' + i} className="post-divider">{displayPost(post, i)}</div>
                            }
                        })}
                    </div>
                </Route>
                <Route path="/Comments/:id" render={routeProps =>
                    <Comments
                        displayPost={displayPost}
                        rp={routeProps}
                        setScrollPosition={setScrollPosition}
                        updatePost={updatePost}
                    />
                } />
            </Switch>
        </main>
    );
};