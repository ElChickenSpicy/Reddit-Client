import React from 'react';
import { Link } from "react-router-dom";

export class Comments extends React.Component {
    render() {
        return (
            <div id="posts">
                <article className="reddit-post">
                    <div className="post-flex-item sub">
                        <img alt="icon" />
                        <h3>r/something</h3>
                    </div>
                    <div className="post-flex-item content">
                        <h1 className="content-title">Title of Post</h1>
                        <p className="content-media">Content of the post</p>
                    </div>
                    <div className="post-flex-item options">
                        <button>Upvote</button>
                        <button>Downvote</button>
                        <Link to="/Comments"><button>Comments</button></Link>
                        <Link to="/"><button>&#171;</button></Link>

                    </div>
                </article>

                <section className="comments-container">
                    <div className="comment-item">
                        <h2>Username</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                    <div className="comment-item">
                        <h2>Username</h2>
                        <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur?</p>
                    </div>
                    <div className="comment-item">
                        <h2>Username</h2>
                        <p>Quis autem vel eum iure reprehenderit qui in ea voluptate!!</p>
                    </div>
                    <div className="comment-item">
                        <h2>Username</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                </section>
            </div>
        )
    }
};