import React from 'react';
import { Switch, Route, Link } from "react-router-dom";
import { Posts } from '../Posts/Posts';
import { Comments } from '../Comments/Comments';
import { decode } from 'html-entities';
import parse from 'html-react-parser';
import * as dayjs from 'dayjs';

//For embedding content
import TweetEmbed from 'react-tweet-embed'
import YouTube from 'react-youtube';
import Vimeo from '@u-wave/react-vimeo';

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.formatPost = this.formatPost.bind(this);
        this.displayPost = this.displayPost.bind(this);
    }

    displayPost(post) {
        //Object destructuring
        const { data: { all_awardings, author, author_flair_richtext, created_utc, num_comments, permalink, subreddit, subreddit_id, ups } } = post;
        //Does Author have a flair?
        let flair = author_flair_richtext ? author_flair_richtext.length > 0 ? author_flair_richtext[0].u ?
            <img src={author_flair_richtext[0].u} alt="Author's flair" title={author_flair_richtext[0].a} />
            : ''
            : ''
            : '';
        //Retrieve image src and title for the subreddit's info
        const icon = this.props.about.filter(el => el.name === subreddit_id);
        let src = icon[0] ? icon[0].icon_img !== "" && icon[0].icon_img !== null ? icon[0].icon_img : "subreddit/popular.webp" : "subreddit/popular.webp";
        let title = icon[0] ? icon[0].title !== "" && icon[0].title !== null ? icon[0].title : { subreddit } : { subreddit };
        //Pass the post to the formatPost function
        const postOutput = this.formatPost(post);
        return (
            <article className="reddit-post">
                <Link to="/">
                    <div className="post-flex-item sub">
                        <div className="subreddit-data">
                            <img
                                src={src}
                                alt={subreddit}
                                title={title}
                                onClick={() => { this.props.fetchSubredditData(subreddit) }}
                            />
                            <h3 title={title} onClick={() => { this.props.fetchSubredditData(subreddit) }}>r/{subreddit}</h3>
                        </div>
                        <div className="awards-container">
                            {all_awardings.length > -1 ?
                                all_awardings.map(el => {
                                    return <div className="award"><img src={el.icon_url} alt={el.name} title={`${el.name}\n${el.description}`} />x{el.count}</div>
                                }) : ''}
                        </div>
                    </div>
                </Link>
                {postOutput}
                <div className="post-flex-item options">
                    <div className="voting-buttons">
                        <i class="far fa-arrow-alt-circle-up" title="Upvote"></i>
                        <i class="far fa-arrow-alt-circle-down" title="Downvote"></i>
                        <span id="votes">{ups > 999 ? `${(ups / 1000).toFixed(1)}k` : ups}</span>
                    </div>
                    <Link
                        to={`/Comments${[permalink]}`} id="comments" onClick={() => this.props.saveScrollPosition()}>
                        <i className="far fa-comment-alt" title="Comments"></i>
                        <span id="num-comments">{num_comments > 999 ? `${(num_comments / 1000).toFixed(1)}k Comments` : `${num_comments} Comments`}</span>
                    </Link>
                    <span id="posted-by">Posted by: {flair}{author} ~ {dayjs(dayjs.unix(created_utc)).fromNow()}</span>
                </div>
            </article>
        );
    }

    formatPost(post) {
        //YouTube configuration options
        const opts = {
            height: '390',
            width: '640',
            playerVars: {
              // https://developers.google.com/youtube/player_parameters
              autoplay: 0,
            },
          };

        //Variable to store the outputted format of the post
        let output;

        //Object destructuring
        const { data } = post;
        let { domain, selftext, title, url } = data;
        title = decode(title);

        //Reusable JSX element
        const titleLink = 
        <a className="title link" href={url} target="_blank" rel="noreferrer">
            {title}
        </a>;
        
        //Switch statement based on the post_hint property
        switch (data.post_hint) {
            //Link
            case 'link':
                if (data.thumbnail === 'default') {
                    output =
                    <div className="post-flex-item content">
                        <a className="title link oneliner" href={url} target="_blank" rel="noreferrer">
                            {title}
                        </a>
                    </div>
                } else {
                    output =
                    <div className="post-flex-item content">
                        {titleLink}
                        <div className="media">
                            <img className="thumbnail" src={data.thumbnail} alt={title} />
                        </div>
                    </div>
                }  
                break;
            //Image
            case 'image':
                output =
                    <div className="post-flex-item content">
                        {titleLink}
                        <div className="media">
                            <img className="image" src={url} alt={title}/>
                        </div>
                    </div>
                break;
            //Hosted Video
            case 'hosted:video':
                output =
                    <div className="post-flex-item content">
                        {titleLink}
                        <div className="media">
                            <video className="video" controls>
                                <source src={data.secure_media.reddit_video.fallback_url} type="video/mp4"></source>
                            </video>
                        </div>
                    </div>
                break;
            //Rich Video
            case 'rich:video':
                switch (domain) {
                    case 'youtube.com' :
                        output =
                        <div className="post-flex-item content">
                            {titleLink}
                            <div className="media">
                                <YouTube videoId={url.split("=")[1].split("&")[0]} opts={opts} onReady={this._onReady} />
                            </div>
                        </div>
                        break;
                    case 'youtu.be' :
                        output =
                        <div className="post-flex-item content">
                            {titleLink}
                            <div className="media">
                                <YouTube videoId={url.split("/")[3]} opts={opts} onReady={this._onReady} />
                            </div>
                        </div>
                        break;
                    case 'gfycat.com' :
                        output =
                        <div className="post-flex-item content">
                            {titleLink}
                            <div className="media">
                                {parse(decode(data.media_embed.content))}
                            </div>
                        </div>
                        break;
                    case 'vimeo' :
                        output =
                        <div className="post-flex-item content">
                            {titleLink}
                            <div className="media">
                            <Vimeo
                                video={url.split("/")[3]}
                                width="640"
                                height="390"
                            />
                            </div>
                        </div>
                        break;
                    case 'streamable.com' :
                        if (data.secure_media) {
                            output =
                            <div className="post-flex-item content">
                                {titleLink}
                                <div className="media">
                                    {parse(decode(data.secure_media.oembed.html))}
                                </div>
                            </div>
                        } else {
                            output =
                            <div className="post-flex-item content">
                                {titleLink}
                            </div>
                        }
                        break;
                }
                break;
                //Undefined
                case undefined:
                if (selftext !== "") {
                    output =
                        <div className="post-flex-item content">
                            {titleLink}
                            <p className="text">{parse(decode(data.selftext_html))}</p>
                        </div>
                } else if (!domain.startsWith("self")) {
                    switch (domain) {
                        case 'twitter.com' :
                            output =
                            <div className="post-flex-item content">
                                {titleLink}
                                <div className="media">
                                    <TweetEmbed id={url.split("/")[5].split("?")[0]} />
                                </div>
                            </div>
                            break;
                        case 'v.redd.it' :
                            if (data.media) {
                                output =
                                <div className="post-flex-item content">
                                    {titleLink}
                                    <div className="media">
                                        <video className="video" controls>
                                            <source src={data.secure_media.reddit_video.fallback_url} type="video/mp4"></source>
                                        </video>
                                    </div>
                                </div>
                            } else {
                                output =
                                <div className="post-flex-item content">
                                    {titleLink}
                                </div>
                            }
                            break;
                        case 'youtube.com' :
                            output =
                            <div className="post-flex-item content">
                                Crosspost: {titleLink}
                                <div className="media">
                                    <YouTube videoId={url.split("=")[1].split("&")[0]} opts={opts} onReady={this._onReady} />
                                </div>
                            </div>
                            break;
                        case 'youtu.be' :
                            output =
                            <div className="post-flex-item content">
                                {titleLink}
                                <div className="media">
                                    <YouTube videoId={url.split("/")[3]} opts={opts} onReady={this._onReady} />
                                </div>
                            </div>
                            break;
                        case 'i.redd.it' :
                            output =
                            <div className="post-flex-item content">
                                {titleLink}
                                <div className="media">
                                    <img className="image" src={url} alt={title}/>
                                </div>
                            </div>
                            break;
                        case 'streamable.com' :
                            if (data.secure_media) {
                                output =
                                <div className="post-flex-item content">
                                    {titleLink}
                                    <div className="media">
                                        {parse(decode(data.secure_media.oembed.html))}
                                    </div>
                                </div>
                            } else {
                                output =
                                <div className="post-flex-item content">
                                    {titleLink}
                                </div>
                            }
                            break;
                        case 'streamye.com' :
                            output =
                            <div className="post-flex-item content">
                                {titleLink}
                            </div>
                            break;
                        case 'streamja.com' :
                            output =
                            <div className="post-flex-item content">
                                {titleLink}
                            </div>
                            break;
                        default :
                            data.thumbnail === 'default' ? 
                            output =
                            <div className="post-flex-item content">
                                <a className="title link oneliner" href={url} target="_blank" rel="noreferrer">
                                    {title}
                                </a>
                            </div> : 
                            output =
                            <div className="post-flex-item content">
                                <a className="title link" href={url} target="_blank" rel="noreferrer">
                                    {title}
                                </a>
                                <div className="media">
                                    <img className="thumbnail" src={data.thumbnail} alt={title} />
                                </div>
                            </div>
                            break;
                    }
                } else {
                    output =
                        <div className="post-flex-item content">
                            <h1 className="title oneliner">{title}</h1>
                        </div>
                } 
                break;
            //Default
            default:
                output =
                    <div className="post-flex-item content">
                        {titleLink}
                    </div>
                break;
        }
        return output;
    }

    render() {
        return (
            <main>
                <Switch>
                    <Route 
                    path="/" exact 
                    render={routeProps => 
                        <Posts 
                        rp={routeProps} 
                        initialPosts={this.props.posts} 
                        fetchSubredditData={this.props.fetchSubredditData} 
                        about={this.props.about}
                        displayPost={this.displayPost}
                        />
                    }/>
                    <Route 
                    path="/Comments/:id" 
                    render={routeProps => 
                        <Comments 
                        rp={routeProps} 
                        updatePost={this.props.updatePost}
                        about={this.props.about}
                        setScrollPosition={this.props.setScrollPosition}
                        displayPost={this.displayPost}
                        />
                    }/>
                </Switch>        
            </main>
        )
    }
};