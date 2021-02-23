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
                        {this.props.navItems.map(item => {
                            return (
                                <Link to="/">
                                    <li style={this.props.highlightActive[0] === item ? {backgroundColor: 'rgba(255, 153, 0, 0.26)'} : {backgroundColor: 'white'}} onClick={() => {this.props.fetchSubredditData(item)}}>
                                        <img src={"/subreddit/" + item + ".webp"} alt="icon" onError={(e)=>{e.target.onerror = null; e.target.src="/subreddit/reddit.webp"}}/>
                                        r/{item}
                                    </li>
                                </Link>
                            )
                        })}
                    </ul>
                </section>
            </nav>
        )
    }
};