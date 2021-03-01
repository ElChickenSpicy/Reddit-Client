import React from 'react';
import { Switch, Route } from "react-router-dom";
import { Posts } from '../Posts/Posts';
import { Comments } from '../Comments/Comments';
import { decode } from 'html-entities';
import TweetEmbed from 'react-tweet-embed'
import YouTube from 'react-youtube';
import Vimeo from '@u-wave/react-vimeo';
import parse from 'html-react-parser';

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.formatPost = this.formatPost.bind(this);
    }

    formatPost(post) {
        const opts = {
            height: '390',
            width: '640',
            playerVars: {
              // https://developers.google.com/youtube/player_parameters
              autoplay: 0,
            },
          };
        let output;
        
        switch (post.data.post_hint) {
            case 'link':
                post.data.thumbnail === 'default' ? 
                    output =
                    <div className="post-flex-item content">
                        <a className="content-link" href={post.data.url} target="_blank" rel="noreferrer">
                            {post.data.title}
                        </a>
                    </div> : 
                    output =
                    <div className="post-flex-item content">
                        <a className="content-link" href={post.data.url} target="_blank" rel="noreferrer">
                            {post.data.title}
                            <div className="thumbnail-container">
                                <img className="thumbnail" src={post.data.thumbnail} alt='' />
                            </div>
                        </a>
                    </div>;
                break;

            case 'image':
                output =
                    <div className="post-flex-item content">
                        <h1 className="content-title">{post.data.title}</h1>
                        <div className="image-container">
                            <img className="content-image" src={post.data.url} alt=''/>
                        </div>
                    </div>;
                break;

            case undefined:
                if (post.data.selftext !== "") {
                    output =
                        <div className="post-flex-item content">
                            <h1 className="content-title">{post.data.title}</h1>
                            <p className="content-text">{parse(decode(post.data.selftext_html))}</p>
                        </div>
                } else if (post.data.domain === "twitter.com") {
                    output =
                        <div className="post-flex-item content">
                            <h1 className="content-title">{post.data.title}</h1>
                            <TweetEmbed id={post.data.url.split("/")[5].split("?")[0]} />
                        </div>
                } else if (post.data.domain.startsWith("v.redd.it")) {
                    if (post.data.media) {
                        output =
                    <div className="post-flex-item content">
                        <h1 className="content-title">{post.data.title}</h1>
                        <div className="image-container">
                            <video className="content-video" controls>
                                <source src={post.data.secure_media.reddit_video.fallback_url} type="video/mp4"></source>
                            </video>
                        </div>
                    </div>;
                    } else {
                        output =
                    <div className="post-flex-item content">
                        <a className="content-link" href={post.data.url} target="_blank" rel="noreferrer">
                            {post.data.title}
                        </a>
                    </div>;
                    }
                } else if (post.data.domain.startsWith("youtube.com")) {
                    output =
                    <div className="post-flex-item content">
                        <h1 className="content-title">Crosspost: {post.data.title}</h1>
                        <div className="image-container">
                            <YouTube videoId={post.data.url.split("=")[1].split("&")[0]} opts={opts} onReady={this._onReady} />
                        </div>
                    </div>;
                } else if (post.data.domain.startsWith("youtu.be")) {
                    output =
                    <div className="post-flex-item content">
                        <h1 className="content-title">{post.data.title}</h1>
                        <div className="image-container">
                            <YouTube videoId={post.data.url.split("/")[3]} opts={opts} onReady={this._onReady} />
                        </div>
                    </div>;
                } else if (post.data.domain.startsWith("i.redd.it")) {
                    output =
                    <div className="post-flex-item content">
                        <h1 className="content-title">{post.data.title}</h1>
                        <div className="image-container">
                            <img className="content-image" src={post.data.url} alt=''/>
                        </div>
                    </div>;
                } else if (post.data.domain.startsWith("streamable")) {
                    if (post.data.secure_media) {
                        output =
                    <div className="post-flex-item content">
                        <h1 className="content-title">{post.data.title}</h1>
                        <div className="image-container">
                            {parse(decode(post.data.secure_media.oembed.html))}
                        </div>
                    </div>;
                    }
                    output =
                    <div className="post-flex-item content">
                        <a className="content-link" href={post.data.url} target="_blank" rel="noreferrer">
                            {post.data.title}
                        </a>
                    </div>;

                } else if (!post.data.domain.startsWith("self")) {
                        post.data.thumbnail === 'default' ? output =
                        <div className="post-flex-item content">
                            <a className="content-link" href={post.data.url} target="_blank" rel="noreferrer">
                                {post.data.title}
                            </a>
                        </div> : output =
                        <div className="post-flex-item content">
                            <a className="content-link" href={post.data.url} target="_blank" rel="noreferrer">
                                {post.data.title}
                                <div className="thumbnail-container">
                                    <img className="thumbnail" src={post.data.thumbnail} alt='' />
                                </div>
                            </a>
                        </div>;

                } else {
                    output =
                        <div className="post-flex-item content">
                            <h1 className="content-oneliner">{post.data.title}</h1>
                        </div>
                }
                    
                break;

            case 'hosted:video':
                output =
                    <div className="post-flex-item content">
                        <h1 className="content-title">{post.data.title}</h1>
                        <div className="image-container">
                            <video className="content-video" controls>
                                <source src={post.data.secure_media.reddit_video.fallback_url} type="video/mp4"></source>
                            </video>
                        </div>
                    </div>;
                break;

            case 'rich:video':
                if (post.data.domain.startsWith("youtube.com")) {
                    output =
                    <div className="post-flex-item content">
                        <h1 className="content-title">{post.data.title}</h1>
                        <div className="image-container">
                            <YouTube videoId={post.data.url.split("=")[1].split("&")[0]} opts={opts} onReady={this._onReady} />
                        </div>
                    </div>;
                } else if (post.data.domain.startsWith("youtu.be")) {
                    output =
                    <div className="post-flex-item content">
                        <h1 className="content-title">{post.data.title}</h1>
                        <div className="image-container">
                            <YouTube videoId={post.data.url.split("/")[3]} opts={opts} onReady={this._onReady} />
                        </div>
                    </div>;
                } else if (post.data.domain.startsWith("vimeo")) {
                    output =
                    <div className="post-flex-item content">
                        <h1 className="content-title">{post.data.title}</h1>
                        <div className="image-container">
                        <Vimeo
                            video={post.data.url.split("/")[3]}
                            width="640"
                            height="390"
                        />
                        </div>
                    </div>;
                }
                break;
            default:
                output =
                    <div className="post-flex-item content">
                        <h1 className="content-link">{post.data.title}</h1>
                    </div>;
                break;
        }
        return output;
    }

    render() {
        return (
            <main>
                <Switch>
                    <Route path="/" exact render={routeProps => <Posts rp={routeProps} initialPosts={this.props.posts} formatPost={this.formatPost} fetchSubredditData={this.props.fetchSubredditData} about={this.props.about}/>} />
                    <Route path="/Comments/:id" render={routeProps => <Comments rp={routeProps} formatPost={this.formatPost} updatePost={this.props.updatePost} />} />
                </Switch>        
            </main>
        )
    }
};