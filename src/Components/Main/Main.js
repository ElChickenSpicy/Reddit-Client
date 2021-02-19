import React from 'react';
import { BrowserRouter as Router, Switch, Route} from "react-router-dom";
import { Posts } from '../Posts/Posts';
import { Comments } from '../Comments/Comments';
import { decode } from 'html-entities';

export class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = { posts: [] };
        this.fetchInitialData = this.fetchInitialData.bind(this);
        this.formatPost = this.formatPost.bind(this);
      }
    
      async fetchInitialData() {
        //Fetch data from the r/popular page of Reddit
        const response = await fetch('https://www.reddit.com/r/popular.json');
        const jsonResponse = await response.json();
    
        //Store the first 10 posts in state
        const popularPosts = jsonResponse.data.children.slice(0, 10);
        this.setState({ posts: popularPosts })
      }
    
      componentDidMount() {
        this.fetchInitialData();
      }

      formatPost(post) {
        let output;
        let youtube;
        switch (post.data.post_hint) {
            case 'link':
                post.data.thumbnail === 'default' ? output =
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
                post.data.selftext === "" ?
                    output =
                    <div className="post-flex-item content">
                        <h1 className="content-link">{post.data.title}</h1>
                    </div> :
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
                        <div className="image-container" dangerouslySetInnerHTML={{ __html: youtube }}>
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
                    <h2>Current Page</h2>
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

                <Router>
                    <Switch>
                        <Route path="/" exact render={routeProps => <Posts rp={routeProps} initialPosts={this.state.posts} formatPost={this.formatPost}/>}/>
                        <Route path="/Comments/:id" render={routeProps => <Comments rp={routeProps} formatPost={this.formatPost}/>}  />
                    </Switch>
                </Router>
            </main>
        )
    }
};