import React from 'react';

export class Navbar extends React.Component {
    render() {
        return (
            <nav>
                <input className="searchbar" placeholder="Search..."></input>
                <section className="subreddit-container">
                    <header className="subreddit-title">Subreddits</header>
                </section>
            </nav>
        )
    }
};