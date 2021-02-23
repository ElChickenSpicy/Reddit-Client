import React from 'react';
import { Link } from "react-router-dom";

export class Navbar extends React.Component {
    render() {
        return (
            <nav>
                <input className="searchbar" placeholder="Search..."></input>
                <section className="subreddit-container">
                    <header className="subreddit-title">Subreddits</header>
                    <ul> 
                        <Link to="/"><li onClick={() => {this.props.fetchSubredditData('popular'); document.querySelector('.top-container').scrollTo(0, 0);}}><img src="subreddit/reddit.webp" alt="icon"/>r/popular</li></Link>
                        <Link to="/"><li onClick={() => {this.props.fetchSubredditData('soccer'); document.querySelector('.top-container').scrollTo(0, 0);}}><img src="subreddit/soccer.webp" alt="icon"/>r/soccer</li></Link>
                        <Link to="/"><li onClick={() => {this.props.fetchSubredditData('AskReddit'); document.querySelector('.top-container').scrollTo(0, 0);}}><img src="subreddit/AskReddit.webp" alt="icon"/>r/AskReddit</li></Link>
                        <Link to="/"><li onClick={() => {this.props.fetchSubredditData('dataisbeautiful'); document.querySelector('.top-container').scrollTo(0, 0);}}><img src="subreddit/dataisbeautiful.webp" alt="icon"/>r/dataisbeautiful</li></Link>
                        <Link to="/"><li onClick={() => {this.props.fetchSubredditData('ProgrammerHumor'); document.querySelector('.top-container').scrollTo(0, 0);}}><img src="subreddit/ProgrammerHumor.webp" alt="icon"/>r/ProgrammerHumor</li></Link>
                        <Link to="/"><li onClick={() => {this.props.fetchSubredditData('Art'); document.querySelector('.top-container').scrollTo(0, 0);}}><img src="subreddit/Art.webp" alt="icon"/>r/Art</li></Link>
                    </ul>
                </section>
            </nav>
        )
    }
};