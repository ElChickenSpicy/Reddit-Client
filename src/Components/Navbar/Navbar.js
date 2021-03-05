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
                            placeholder="What do you want to see?"
                            onKeyUp={({ key, target: { value } }) => {
                                if (key === "Enter") {
                                    this.props.search(`https://www.reddit.com/search.json?q=${encodeURI(value)}`, value);
                                    this.clearSearch();
                                }
                            }}
                        />
                        <i className="fa fa-search"></i>
                    </div>
                    <Link to="/" className="first40">
                        <img id="normal" src={icon} alt="Icon" onClick={() => this.props.fetchSubredditData('popular')} onMouseOver={() => this.hoverImage()} />
                        <img id="hoverImage" src={hoverIcon} alt="Icon" style={{ display: "none" }} onClick={() => this.props.fetchSubredditData('popular')} onMouseLeave={() => this.hoverImage()} />
                        <h1 className="name" onClick={() => this.props.fetchSubredditData('popular')}>R</h1>
                        <h1 className="name" onClick={() => this.props.fetchSubredditData('popular')}>e</h1>
                        <h1 className="name" onClick={() => this.props.fetchSubredditData('popular')}>l</h1>
                        <h1 className="name" onClick={() => this.props.fetchSubredditData('popular')}>a</h1>
                        <h1 className="name" onClick={() => this.props.fetchSubredditData('popular')}>x</h1>
                    </Link>
                </section>
                <section className="subreddit-container">
                    <header className="subreddit-title">
                        <h2>My Subreddits</h2>
                    </header>
                    <ul>
                        {this.props.navItems.map(item => {
                            let find = this.props.subredditsAbout.filter(el => el.display_name === item);
                            if (find.length > -1) {
                                const { display_name, icon_img, title } = find[0];
                                return (
                                    <Link to="/">
                                        <li 
                                        id="nav-item"
                                        title={title}
                                        style={this.props.highlightActive[0] === display_name ? { backgroundColor: 'rgba(211, 211, 211, 0.212)' } : { backgroundColor: 'white' }} 
                                        onClick={() => { this.props.fetchSubredditData(display_name) }}
                                        >
                                            <img src={`${icon_img}`} alt={display_name}/>
                                            r/{display_name}
                                        </li>
                                    </Link>
                                );
                            }
                        })}
                    </ul>
                </section>
            </nav>
        )
    }
};