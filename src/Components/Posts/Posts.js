import React from 'react';
import { Link } from "react-router-dom";
import { decode } from 'html-entities';

export class Posts extends React.Component {

    render() {
        return (
            <div id="posts">
                {this.props.initialPosts.map(post => {
                    let output;
                    let youtube;
                    switch (post.data.post_hint) {
                        case 'link':
                            post.data.thumbnail == 'default' ? output =
                                <div className="post-flex-item content">
                                    <a className="content-link" href={post.data.url} target="_blank">
                                        {post.data.title}
                                    </a>
                                </div> : output =
                                <div className="post-flex-item content">
                                    <a className="content-link" href={post.data.url} target="_blank">
                                        {post.data.title}
                                        <div className="thumbnail-container">
                                            <img className="thumbnail" src={post.data.thumbnail} />
                                        </div>
                                    </a>
                                </div>;
                            break;

                        case 'image':
                            output =
                                <div className="post-flex-item content">
                                    <h1 className="content-title">{post.data.title}</h1>
                                    <div className="image-container">
                                        <img className="content-image" src={post.data.url} />
                                    </div>
                                </div>;
                            break;

                        case undefined:
                            output =
                                <div className="post-flex-item content">
                                    <h1 className="content-title">{post.data.title}</h1>
                                    <p className="content-text">{post.data.selftext}</p>
                                </div>;
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
                            youtube = decode(post.data.media_embed.content)
                            output =
                                <div className="post-flex-item content">
                                    <h1 className="content-title">{post.data.title}</h1>
                                    <div className="image-container" dangerouslySetInnerHTML={{__html: youtube}}>
                                    </div>
                                </div>;
                            break;
                    }

                    return (
                        <article className="reddit-post">
                            <div className="post-flex-item sub">
                                <img alt="icon" />
                                <h3>r/{post.data.subreddit}</h3>
                            </div>
                            {output}
                            <div className="post-flex-item options">
                                <button className="vote up">&#8593;</button>
                                <button className="vote down">&#8595;</button>
                                <Link to="/Comments"><button>Comments</button></Link>
                            </div>
                        </article>
                    );

                })}
            </div>
        )
    }
};