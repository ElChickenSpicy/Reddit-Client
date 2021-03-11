import React from 'react';
import { Switch, Route, Link } from "react-router-dom";
import { Posts } from '../Posts/Posts';
import { Comments } from '../Comments/Comments';
import { decode } from 'html-entities';
import parse from 'html-react-parser';
import * as dayjs from 'dayjs';
import defaultImg from '../../Icons/popular.webp';
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
        let src = icon[0] ? icon[0].icon_img !== "" && icon[0].icon_img !== null ? icon[0].icon_img : defaultImg : defaultImg;
        let title = icon[0] ? icon[0].title !== "" && icon[0].title !== null ? icon[0].title : { subreddit } : { subreddit };

        //Save JSX returned from the formatPost function
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
                                all_awardings.map(({ icon_url, name, description, count }) => {
                                    return <div className="award"><img src={icon_url} alt={name} title={`${name}\n${description}`} />x{count}</div>
                                }) : ''}
                        </div>
                    </div>
                </Link>
                <div className="post-flex-item content">
                    {postOutput}
                </div>
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

    //Based on post type, display it in a certain way
    formatPost(post) {

        //YouTube config settings
        const opts = {
            height: '390',
            width: '640',
            playerVars: {
                // https://developers.google.com/youtube/player_parameters
                autoplay: 0,
            },
        };

        //Variable to store returned JSX
        let output = [];

        //Object destructuring
        let { data, data: { domain, selftext, title, url } } = post;
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
                    output.push(
                        <a className="title link oneliner" href={url} target="_blank" rel="noreferrer">
                            {title}
                        </a>
                    );       
                } else {
                    output.push(
                        titleLink,
                        <div className="media">
                            <img className="thumbnail" src={data.thumbnail} alt={title} />
                        </div>
                    );          
                }
                break;
            //Image
            case 'image':
                output.push(
                    titleLink,
                    <div className="media">
                        <img className="image" src={url} alt={title} />
                    </div>
                );      
                break;
            //Hosted Video
            case 'hosted:video':
                output.push(
                    titleLink,
                    <div className="media">
                        <video className="video" controls>
                            <source src={data.secure_media.reddit_video.fallback_url} type="video/mp4"></source>
                        </video>
                    </div>
                );     
                break;
            //Rich Video
            case 'rich:video':
                switch (domain) {
                    case 'youtube.com':
                        output.push(
                            titleLink,
                            <div className="media">
                                <YouTube videoId={url.split("=")[1].split("&")[0]} opts={opts} onReady={this._onReady} />
                            </div>
                        );      
                        break;
                    case 'youtu.be':
                        output.push(
                            titleLink,
                            <div className="media">
                                <YouTube videoId={url.split("/")[3]} opts={opts} onReady={this._onReady} />
                            </div>
                        );             
                        break;
                    case 'gfycat.com':
                        output.push(
                            titleLink,
                            <div className="media">
                                {parse(decode(data.media_embed.content))}
                            </div>                           
                        );     
                        break;
                    case 'vimeo':
                        output.push(
                            titleLink,
                            <div className="media">
                                <Vimeo
                                    video={url.split("/")[3]}
                                    width="640"
                                    height="390"
                                />
                            </div>
                        );     
                        break;
                    case 'streamable.com':
                        if (data.secure_media) {
                            output.push(
                                titleLink,
                                <div className="media">
                                    {parse(decode(data.secure_media.oembed.html))}
                                </div>
                            );    
                        } else {
                            output.push(titleLink);         
                        }
                        break;
                }
                break;
            //Undefined
            case undefined:
                if (selftext !== "") {
                    output.push(
                        titleLink,
                        <div className="special-text" >
                            {parse(decode(data.selftext_html))}
                        </div>
                    );   
                    break;
                } else if (!domain.startsWith("self")) {
                    switch (domain) {
                        case 'twitter.com':
                            output.push(
                                titleLink,
                                <div className="media">
                                    <TweetEmbed id={url.split("/")[5].split("?")[0]} />
                                </div>
                            );   
                            break;
                        case 'v.redd.it':
                            if (data.media) {
                                output.push(
                                    titleLink,
                                    <div className="media">
                                        <video className="video" controls>
                                            <source src={data.secure_media.reddit_video.fallback_url} type="video/mp4"></source>
                                        </video>
                                    </div>
                                );    
                            } else {
                                output.push(titleLink);
                            }
                            break;
                        case 'youtube.com':
                            output.push(
                                    titleLink,
                                    <div className="media">
                                        <YouTube videoId={url.split("=")[1].split("&")[0]} opts={opts} onReady={this._onReady} />
                                    </div>
                            );    
                            break;
                        case 'youtu.be':
                            output.push(
                                titleLink,
                                <div className="media">
                                    <YouTube videoId={url.split("/")[3]} opts={opts} onReady={this._onReady} />
                                </div>
                            );       
                            break;
                        case 'i.redd.it':
                            output.push(
                                titleLink,
                                <div className="media">
                                    <img className="image" src={url} alt={title} />
                                </div>
                            );   
                            break;
                        case 'streamable.com':
                            if (data.secure_media) {
                                output.push(
                                    titleLink,
                                    <div className="media">
                                        {parse(decode(data.secure_media.oembed.html))}
                                    </div>
                                );   
                            } else {
                                output.push(titleLink);     
                            }
                            break;
                        case 'streamye.com':
                            output.push(titleLink); 
                            break;
                        case 'streamja.com':
                            output.push(titleLink); 
                            break;
                        default:
                            data.thumbnail === 'default' ?
                                output.push(
                                    <a className="title link oneliner" href={url} target="_blank" rel="noreferrer">
                                        {title}
                                    </a>
                                ):
                                output.push(
                                    <a className="title link" href={url} target="_blank" rel="noreferrer">
                                        {title}
                                    </a>,
                                    <div className="media">
                                        <img className="thumbnail" src={data.thumbnail} alt={title} />
                                    </div>
                                );     
                            break;
                    }
                } else {
                    output.push(
                        <h1 className="title oneliner">{title}</h1>
                    );  
                }
                break;
            //Default
            default:
                output.push(titleLink);
                break;
        }
        return output;
    }

    render() {
        return (
            <main>
                <Switch>
                    <Route path="/" exact render={routeProps =>
                        <Posts
                            rp={routeProps}
                            initialPosts={this.props.posts}
                            fetchSubredditData={this.props.fetchSubredditData}
                            about={this.props.about}
                            displayPost={this.displayPost}
                        />
                    } />
                    <Route path="/Comments/:id" render={routeProps =>
                        <Comments
                            rp={routeProps}
                            updatePost={this.props.updatePost}
                            about={this.props.about}
                            setScrollPosition={this.props.setScrollPosition}
                            displayPost={this.displayPost}
                        />
                    } />
                </Switch>
            </main>
        );
    }
};