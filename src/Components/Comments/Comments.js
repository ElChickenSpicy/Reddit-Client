import React from 'react';
import { Link } from "react-router-dom";

export class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            post: [],
            comments: []
         };
        this.commentsFetch = this.commentsFetch.bind(this);
    }

    async commentsFetch() {
        //Format the string to make the fetch request
        let str = this.props.rp.location.pathname;
        str = str.substring(9, str.length)
        let queryString = 'https://www.reddit.com' + str + '.json';

        //Request the data from Reddit
        const response = await fetch(queryString);
        const jsonResponse = await response.json();
        this.setState( {
            post: jsonResponse[0].data.children,
            comments: jsonResponse[1].data.children
        })
        console.log(this.state.post);
        console.log(this.state.comments);
    }

    componentDidMount() {
        this.commentsFetch();
    }

    render() {
        return (
            <div id="posts">
                {this.state.post.map(post => {
                    const postOutput = this.props.formatPost(post)
                    return (
                        <article className="reddit-post">
                            <div className="post-flex-item sub">
                                <img alt="icon" />
                                <h3>r/{post.data.subreddit}</h3>
                            </div>
                            {postOutput}
                            <div className="post-flex-item options">
                                <button className="vote up">&#8593;</button>
                                <button className="vote down">&#8595;</button>
                                <Link to={`/Comments${[post.data.permalink]}`}><button>Comments</button></Link>
                                <Link to="/"><button>&#171;</button></Link>
                            </div>
                        </article>
                    );
                })}

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