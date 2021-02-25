import React from 'react';
import { Link } from "react-router-dom";

export class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.clearSearch = this.clearSearch.bind(this);
    }

    clearSearch() {
        document.getElementById('searchbar').value = "";
    }

    render() {
        return (
            <nav>
                <input 
                    id="searchbar"
                    className="searchbar" 
                    placeholder="Search..." 
                    //When the user inputs info to the searchbar and hits enter, 
                    //encode the text and call the search function with the text as the argument
                    onKeyUp={({key, target: {value}}) => {
                        if (key === "Enter") {
                            this.props.search(`https://www.reddit.com/search.json?q=${encodeURI(value)}`, value);
                            this.clearSearch();
                        }
                    }}>
                </input>
                <section className="subreddit-container">
                    <header className="subreddit-title">Subreddits</header>
                    <ul> 
                        {this.props.navItems.map(item => {
                            return (
                                <Link to="/">
                                    <li style={this.props.highlightActive[0] === item ? {backgroundColor: '#91e6fd9d'} : {backgroundColor: 'white'}} onClick={() => {this.props.fetchSubredditData(item)}}>
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