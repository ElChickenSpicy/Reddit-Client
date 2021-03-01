import React from 'react';
import { Link } from "react-router-dom";
import icon from '../../Icons/logoRelax.webp';
import hoverIcon from '../../Icons/logoRelaxHover.webp';

export class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.clearSearch = this.clearSearch.bind(this);
        this.hoverImage = this.hoverImage.bind(this);
    }

    clearSearch() {
        document.getElementById('searchbar').value = "";
    }

    hoverImage() {
        document.getElementById('normal').style.display === "none" ? document.getElementById('normal').style.display = "inline-block" : document.getElementById('normal').style.display = "none";
        document.getElementById('hoverImage').style.display === "none" ? document.getElementById('hoverImage').style.display = "inline-block" : document.getElementById('hoverImage').style.display = "none";
    }

    render() {
        return (
            <nav>
                <section className="branding">
                <div className="form">
                        {/* When the user inputs info to the searchbar and hits enter, 
                        encode the text and call the search function with the text as the argument 
                        Note: Below searchbar adapted from design available @ https://uicookies.com/html-search-box/*/}
                        <input
                            id="searchbar"
                            className="searchbar"
                            placeholder="Search..."
                            onKeyUp={({ key, target: { value } }) => {
                                if (key === "Enter") {
                                    this.props.search(`https://www.reddit.com/search.json?q=${encodeURI(value)}`, value);
                                    this.clearSearch();
                                }
                            }}
                        />
                        <i class="fa fa-search"></i>
                    </div>
                    <Link to="/" className="first40">
                        <img id="normal" src={icon} alt="Icon" onClick={() => this.props.fetchSubredditData('popular')} onMouseOver={() => this.hoverImage()} />
                        <img id="hoverImage" src={hoverIcon} alt="Icon" style={{ display: "none" }} onClick={() => this.props.fetchSubredditData('popular')} onMouseLeave={() => this.hoverImage()} />
                        <h1 className="name" onClick={() => this.props.fetchSubredditData('popular')}>R</h1>
                        <h1 className="name" onClick={() => this.props.fetchSubredditData('popular')}>E</h1>
                        <h1 className="name" onClick={() => this.props.fetchSubredditData('popular')}>L</h1>
                        <h1 className="name" onClick={() => this.props.fetchSubredditData('popular')}>A</h1>
                        <h1 className="name" onClick={() => this.props.fetchSubredditData('popular')}>X</h1>
                    </Link>
                </section>
                <section className="subreddit-container">
                    <header className="subreddit-title">
                        <h2>Subreddits</h2>
                    </header>
                    <ul>
                        {this.props.navItems.map(item => {
                            return (
                                <Link to="/">
                                    <li 
                                    style={this.props.highlightActive[0] === item ? { backgroundColor: 'rgba(211, 211, 211, 0.212)' } : { backgroundColor: 'white' }} 
                                    onClick={() => { this.props.fetchSubredditData(item) }}
                                    >
                                        <img src={"/subreddit/" + item + ".webp"} alt="icon" onError={(e) => { e.target.onerror = null; e.target.src = "/subreddit/reddit.webp" }} />
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