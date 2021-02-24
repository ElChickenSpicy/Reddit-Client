import React from 'react';
import { Switch, Route } from "react-router-dom";
import { Posts } from '../Posts/Posts';
import { Comments } from '../Comments/Comments';
import { decode } from 'html-entities';
import TweetEmbed from 'react-tweet-embed'

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.formatPost = this.formatPost.bind(this);
    }

    formatPost(post) {
        let output;
        switch (post.data.post_hint) {
            case 'link':
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
                            <p className="content-text">{post.data.selftext}</p>
                        </div>
                } else if (post.data.domain === "twitter.com") {
                    output =
                        <div className="post-flex-item content">
                            <h1 className="content-title">{post.data.title}</h1>
                            <TweetEmbed id={post.data.url.split("/")[5].split("?")[0]} />
                        </div>
                } else if (post.data.domain.startsWith("v.redd.it")) {
                    output =
                    <div className="post-flex-item content">
                        <h1 className="content-title">{post.data.title}</h1>
                        <div className="image-container">
                            <video className="content-video" controls>
                                <source src={post.data.secure_media.reddit_video.fallback_url} type="video/mp4"></source>
                            </video>
                        </div>
                    </div>;
                } else if (post.data.domain.startsWith("youtube")) {
                    output =
                    <div className="post-flex-item content">
                        <h1 className="content-title">{post.data.title}</h1>
                        <div className="image-container" dangerouslySetInnerHTML={{ __html: decode(post.data.media_embed.content) }}>
                        </div>
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
                output =
                    <div className="post-flex-item content">
                        <h1 className="content-title">{post.data.title}</h1>
                        <div className="image-container" dangerouslySetInnerHTML={{ __html: decode(post.data.media_embed.content) }}>
                        </div>
                    </div>;
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
                <header className="main-header">
                    {/* Desktop View */}
                    <div id="main-subreddit">
                        {/* If the below subreddit isn't included in state.nav, display a button with a + sign, otherwise display a minus sign */}
                        {/* Also, some formatting for if it is Search Results */}
                        {this.props.subreddit.startsWith("Search Results") ?
                            <h2>{this.props.subreddit}</h2> :
                            this.props.navItems.includes(this.props.subreddit) === true ?
                                <figure>
                                    <h2>r/{this.props.subreddit}</h2>
                                    <button className="remove" onClick={() => this.props.removeSubreddit(this.props.subreddit)}>-</button>
                                    <figcaption>
                                        <p id="informational">Remove this subreddit from your Navigation Bar</p>
                                    </figcaption>
                                </figure> :
                                <figure>
                                    <h2>r/{this.props.subreddit}</h2>
                                    <button className="add" onClick={() => this.props.addSubreddit(this.props.subreddit)}>+</button>
                                    <figcaption>
                                        <p id="informational">Add this subreddit to your Navigation Bar</p>
                                    </figcaption>
                                </figure>
                        }
                    </div>
                    <div id="brand">
                        <img alt="icon" />
                        <h1>Sean's Reddit App</h1>
                    </div>

                    {/* Mobile View */}
                    <select>
                        <option value="0">r/All</option>
                        <option value="1">r/soccer</option>
                        <option value="2">r/ProgrammerHumor</option>
                        <option value="3">r/coolguides</option>
                        <option value="4">r/dataisbeautiful</option>
                        <option value="5">r/ABoringDystopia</option>
                    </select>
                    <input placeholder="Search..." />
                </header>

                    <Switch>
                        <Route path="/" exact render={routeProps => <Posts rp={routeProps} initialPosts={this.props.posts} formatPost={this.formatPost} fetchSubredditData={this.props.fetchSubredditData}/>} />
                        <Route path="/Comments/:id" render={routeProps => <Comments rp={routeProps} formatPost={this.formatPost} updatePost={this.props.updatePost} />} />
                    </Switch>
                    
            </main>
        )
    }
};