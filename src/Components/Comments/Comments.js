import React from 'react';
import { Link } from "react-router-dom";
import { decode } from 'html-entities';

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
        this.setState({
            post: jsonResponse[0].data.children,
            comments: jsonResponse[1].data.children
        })
        console.log(this.state.comments);
    }

    componentDidMount() {
        this.commentsFetch();
        document.querySelector('.top-container').scrollTo(0,0)
    }

    render() {
        return (
            <div id="posts" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
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
                                <button className="vote up"></button>
                                <button className="vote down"></button>
                                <Link to={`/Comments${[post.data.permalink]}`}><button className="comment-button"></button></Link>
                                <Link to="/"><button className="back-button"></button></Link>
                            </div>
                        </article>
                    );
                })}

                <section className="comments-container">
                    {this.state.comments.map(comment => {
                        return (

                            //1st Comment
                            comment.kind === 'more' ?
                                //true
                                '' :
                                //false 
                                <div className="comment-item">
                                    <h2>u/{comment.data.author}</h2>
                                    <p>{decode(comment.data.body)}</p>

                                    {/* 2nd Comment */}
                                    {comment.data.replies.data ? 
                                        //true
                                        comment.data.replies.data.children.length > 1 ?
                                            //true
                                            comment.data.replies.data.children.slice(0, comment.data.replies.data.children.length -1).map(reply => {
                                                return (
                                                    <div className="first-reply-layer">
                                                        <h2>u/{reply.data.author}</h2>
                                                        <p>{decode(reply.data.body)}</p>

                                                        {/* 3rd Comment */}
                                                        {reply.data.replies.data ? 
                                                            //true
                                                            reply.data.replies.data.children.length > 1 ?
                                                                //true
                                                                reply.data.replies.data.children.slice(0, reply.data.replies.data.children.length -1).map(secondLayer => {
                                                                    return (
                                                                        <div className="second-reply-layer">
                                                                            <h2>u/{secondLayer.data.author}</h2>
                                                                            <p>{decode(secondLayer.data.body)}</p>
                                                                        </div>
                                                                    )
                                                                })
                                                                :
                                                                //false
                                                                '' :
                                                            //false
                                                            ''}
                                                    </div>
                                                )

                                            })
                                             :
                                            //false
                                            '' :
                                        //false
                                        ''}

                                        
                                </div>
                        )
                    })}
                </section>
            </div>
        )
    }
};