import React from 'react';
import { Switch, Route } from "react-router-dom";
import { Posts } from '../Posts/Posts';
import { Comments } from '../Comments/Comments';
import { decode } from 'html-entities';
import parse from 'html-react-parser';
//For embedding content
import TweetEmbed from 'react-tweet-embed'
import YouTube from 'react-youtube';
import Vimeo from '@u-wave/react-vimeo';

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.formatPost = this.formatPost.bind(this);
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
        const titleLink = 
        <a className="content-link" href={url} target="_blank" rel="noreferrer">
            {title}
        </a>;
        
        //Switch statement based on the post_hint property
        switch (data.post_hint) {
            //Link
            case 'link':
                if (data.thumbnail === 'default') {
                    output =
                    <div className="post-flex-item content">
                        {titleLink}
                    </div>
                } else {
                    output =
                    <div className="post-flex-item content">
                        <a className="content-link" href={url} target="_blank" rel="noreferrer">
                            {title}
                            <div className="thumbnail-container">
                                <img className="thumbnail" src={data.thumbnail} alt={title} />
                            </div>
                        </a>
                    </div>;
                }  
                break;
            //Image
            case 'image':
                output =
                    <div className="post-flex-item content">
                        {titleLink}
                        <div className="image-container">
                            <img className="content-image" src={url} alt={title}/>
                        </div>
                    </div>;
                break;
            //Hosted Video
            case 'hosted:video':
                output =
                    <div className="post-flex-item content">
                        {titleLink}
                        <div className="image-container">
                            <video className="content-video" controls>
                                <source src={data.secure_media.reddit_video.fallback_url} type="video/mp4"></source>
                            </video>
                        </div>
                    </div>;
                break;
            //Rich Video
            case 'rich:video':
                switch (domain) {
                    case 'youtube.com' :
                        output =
                        <div className="post-flex-item content">
                            {titleLink}
                            <div className="image-container">
                                <YouTube videoId={url.split("=")[1].split("&")[0]} opts={opts} onReady={this._onReady} />
                            </div>
                        </div>;
                        break;
                    case 'youtu.be' :
                        output =
                        <div className="post-flex-item content">
                            {titleLink}
                            <div className="image-container">
                                <YouTube videoId={url.split("/")[3]} opts={opts} onReady={this._onReady} />
                            </div>
                        </div>;
                        break;
                    case 'gfycat.com' :
                        output =
                        <div className="post-flex-item content">
                            {titleLink}
                            <div className="image-container">
                                {parse(decode(data.media_embed.content))}
                            </div>
                        </div>;
                        break;
                    case 'vimeo' :
                        output =
                        <div className="post-flex-item content">
                            {titleLink}
                            <div className="image-container">
                            <Vimeo
                                video={url.split("/")[3]}
                                width="640"
                                height="390"
                            />
                            </div>
                        </div>;
                        break;
                }
                break;
                //Undefined
                case undefined:
                if (selftext !== "") {
                    output =
                        <div className="post-flex-item content">
                            {titleLink}
                            <p className="content-text">{parse(decode(data.selftext_html))}</p>
                        </div>
                } else if (!domain.startsWith("self")) {
                    switch (domain) {
                        case 'twitter.com' :
                            output =
                            <div className="post-flex-item content">
                                {titleLink}
                                <TweetEmbed id={url.split("/")[5].split("?")[0]} />
                            </div>
                            break;
                        case 'v.redd.it' :
                            if (data.media) {
                                output =
                                <div className="post-flex-item content">
                                    {titleLink}
                                    <div className="image-container">
                                        <video className="content-video" controls>
                                            <source src={data.secure_media.reddit_video.fallback_url} type="video/mp4"></source>
                                        </video>
                                    </div>
                                </div>;
                            } else {
                                output =
                                <div className="post-flex-item content">
                                    {titleLink}
                                </div>;
                            }
                            break;
                        case 'youtube.com' :
                            output =
                            <div className="post-flex-item content">
                                Crosspost: {titleLink}
                                <div className="image-container">
                                    <YouTube videoId={url.split("=")[1].split("&")[0]} opts={opts} onReady={this._onReady} />
                                </div>
                            </div>;
                            break;
                        case 'youtu.be' :
                            output =
                            <div className="post-flex-item content">
                                {titleLink}
                                <div className="image-container">
                                    <YouTube videoId={url.split("/")[3]} opts={opts} onReady={this._onReady} />
                                </div>
                            </div>;
                            break;
                        case 'i.redd.it' :
                            output =
                            <div className="post-flex-item content">
                                {titleLink}
                                <div className="image-container">
                                    <img className="content-image" src={url} alt=''/>
                                </div>
                            </div>;
                            break;
                        case 'streamable' :
                            if (data.secure_media) {
                                output =
                                <div className="post-flex-item content">
                                    {titleLink}
                                    <div className="image-container">
                                        {parse(decode(data.secure_media.oembed.html))}
                                    </div>
                                </div>;
                            } else {
                                output =
                                <div className="post-flex-item content">
                                    {titleLink}
                                </div>;
                            }
                            break;
                        default :
                            data.thumbnail === 'default' ? 
                            output =
                            <div className="post-flex-item content">
                                {titleLink}
                            </div> : 
                            output =
                            <div className="post-flex-item content">
                                <a className="content-link" href={url} target="_blank" rel="noreferrer">
                                    {title}
                                    <div className="thumbnail-container">
                                        <img className="thumbnail" src={data.thumbnail} alt='' />
                                    </div>
                                </a>
                            </div>;
                            break;
                    }
                } else {
                    output =
                        <div className="post-flex-item content">
                            <h1 className="content-oneliner">{title}</h1>
                        </div>
                } 
                break;
            //Default
            default:
                output =
                    <div className="post-flex-item content">
                        {titleLink}
                    </div>;
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
                        formatPost={this.formatPost} 
                        fetchSubredditData={this.props.fetchSubredditData} 
                        about={this.props.about}
                        />
                    }/>
                    <Route 
                    path="/Comments/:id" 
                    render={routeProps => 
                        <Comments 
                        rp={routeProps} 
                        formatPost={this.formatPost} 
                        updatePost={this.props.updatePost} 
                        />
                    }/>
                </Switch>        
            </main>
        )
    }
};