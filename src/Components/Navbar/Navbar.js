import React from 'react';

export class Navbar extends React.Component {
    render() {
        return (
            <nav>
                <input className="searchbar" placeholder="Search..."></input>
                <section className="subreddit-container">
                    <header className="subreddit-title">Subreddits</header>
                    <ul>
                        <li onClick={() => {this.props.fetchSubredditData('popular'); document.querySelector('.top-container').scrollTo(0, 0);}}><img alt="icon"/>r/popular</li>
                        <li onClick={() => {this.props.fetchSubredditData('soccer'); document.querySelector('.top-container').scrollTo(0, 0);}}><img alt="icon"/>r/soccer</li>
                        <li onClick={() => {this.props.fetchSubredditData('AskReddit'); document.querySelector('.top-container').scrollTo(0, 0);}}><img alt="icon"/>r/AskReddit</li>
                        <li onClick={() => {this.props.fetchSubredditData('dataisbeautiful'); document.querySelector('.top-container').scrollTo(0, 0);}}><img alt="icon"/>r/dataisbeautiful</li>
                        <li onClick={() => {this.props.fetchSubredditData('ProgrammerHumor'); document.querySelector('.top-container').scrollTo(0, 0);}}><img alt="icon"/>r/ProgrammerHumor</li>
                        <li onClick={() => {this.props.fetchSubredditData('coolguides'); document.querySelector('.top-container').scrollTo(0, 0);}}><img alt="icon"/>r/coolguides</li>
                        <li onClick={() => {this.props.fetchSubredditData('ABoringDystopia'); document.querySelector('.top-container').scrollTo(0, 0);}}><img alt="icon"/>r/ABoringDystopia</li>
                    </ul>
                </section>
            </nav>
        )
    }
};