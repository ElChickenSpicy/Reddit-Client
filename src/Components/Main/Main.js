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
        this.state = { 
            scrollPosition: [] 
        };
        this.formatPost = this.formatPost.bind(this);
        this.saveScrollPosition = this.saveScrollPosition.bind(this);
        this.setScrollPosition = this.setScrollPosition.bind(this);
    }

    saveScrollPosition() {
        const left = document.querySelector('.top-container').scrollLeft;
        const top =  document.querySelector('.top-container').scrollTop;
        const container = [left, top];
        this.setState({ scrollPosition: [ ...container ] });
    }

    setScrollPosition() {
        document.querySelector('.top-container').scrollTo(...this.state.scrollPosition);
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

        //Reusable JSX elements
        const titleLink = 
        <a className="title link" href={url} target="_blank" rel="noreferrer">
            {title}
        </a>;
        const plainHeading = 
        <h1 className="title">{title}</h1>;
        
        //Switch statement based on the post_hint property
        switch (data.post_hint) {
            //Link
            case 'link':
                if (data.thumbnail === 'default') {
                    output =
                    <div className="post-flex-item content">
                        <a className="title link oneliner" href={url} target="_blank" rel="noreferrer">
                            {title}
                        </a>;
                    </div>
                } else {
                    output =
                    <div className="post-flex-item content">
                        {titleLink}
                        <div className="media">
                            <img className="thumbnail" src={data.thumbnail} alt={title} />
                        </div>
                    </div>;
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
                    </div>;
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
                    </div>;
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
                        </div>;
                        break;
                    case 'youtu.be' :
                        output =
                        <div className="post-flex-item content">
                            {titleLink}
                            <div className="media">
                                <YouTube videoId={url.split("/")[3]} opts={opts} onReady={this._onReady} />
                            </div>
                        </div>;
                        break;
                    case 'gfycat.com' :
                        output =
                        <div className="post-flex-item content">
                            {titleLink}
                            <div className="media">
                                {parse(decode(data.media_embed.content))}
                            </div>
                        </div>;
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
                                <div className="media">
                                    <YouTube videoId={url.split("=")[1].split("&")[0]} opts={opts} onReady={this._onReady} />
                                </div>
                            </div>;
                            break;
                        case 'youtu.be' :
                            output =
                            <div className="post-flex-item content">
                                {titleLink}
                                <div className="media">
                                    <YouTube videoId={url.split("/")[3]} opts={opts} onReady={this._onReady} />
                                </div>
                            </div>;
                            break;
                        case 'i.redd.it' :
                            output =
                            <div className="post-flex-item content">
                                {titleLink}
                                <div className="media">
                                    <img className="image" src={url} alt=''/>
                                </div>
                            </div>;
                            break;
                        case 'streamable' :
                            if (data.secure_media) {
                                output =
                                <div className="post-flex-item content">
                                    {titleLink}
                                    <div className="media">
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
                                    <img className="thumbnail" src={data.thumbnail} alt='' />
                                </div>
                            </div>;
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
                        saveScrollPosition={this.saveScrollPosition}
                        />
                    }/>
                    <Route 
                    path="/Comments/:id" 
                    render={routeProps => 
                        <Comments 
                        rp={routeProps} 
                        formatPost={this.formatPost} 
                        updatePost={this.props.updatePost}
                        about={this.props.about}
                        setScrollPosition={this.setScrollPosition}
                        />
                    }/>
                </Switch>        
            </main>
        )
    }
};