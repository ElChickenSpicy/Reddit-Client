import React from 'react';
import { Link } from "react-router-dom";
import icon from '../../Icons/black.webp';
import defaultImg from '../../Icons/popular.webp';
import retroSearch from '../../Icons/retro-Search.png';
import heart from '../../Icons/heart.webp';

export class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: 'Retro',
            colors: [ '#ff2941', '#fe18d3', '#4206f1', '#74ee15', '#4deeea' ]
        };
    }

    render() {
        return (
            <nav>
                <section className="branding">
                    <div className="form">
                        <input
                            id="searchbar"
                            placeholder="Search Reddit..."
                            onKeyUp={({ key, target: { value } }) => {
                                if (key === "Enter") {
                                    this.props.fetchPosts(`search.json?q=${encodeURI(value)}`, `Search Results: ${value}`);
                                    this.props.clearSearch('searchbar');
                                }
                            }}
                        />
                        <div className="search-container">
                            <img className="search-icon" src={retroSearch} />
                        </div>
                    </div>

                    {/* Clicking the icon or text will return user to home screen and r/popular posts */}
                    <Link
                        to="/"
                        className="first40"
                        onClick={() => {
                            this.props.fetchPosts('r/popular.json', 'popular');
                            this.props.fetchTop();
                        }}
                    >
                        <img 
                            id="I" 
                            src={icon} 
                            alt="Icon"
                            onMouseEnter={({ target: { id }}) => document.getElementById(id).style.backgroundColor = this.state.colors[Math.floor(Math.random() * 5)]}
                            onMouseLeave={({ target: { id }}) => document.getElementById(id).style.backgroundColor = '#888'}
                        />
                        {[...this.state.name].map(letter => {
                            return (
                                <h1 
                                    id={letter} 
                                    className="name" 
                                    onMouseEnter={({ target: { id }}) => document.getElementById(id).style.color = this.state.colors[Math.floor(Math.random() * 5)]}
                                    onMouseLeave={({ target: { id }}) => document.getElementById(id).style.color = 'black'}>
                                    {letter}
                                </h1>
                            )
                        })}
                    </Link>
                </section>

                {/* Display each of the users saved subreddits in Nav section */}
                <section className="subreddit-container">
                    <div className="decorative"></div>
                    <header className="subreddit-title">
                        <img className="icon" src={heart} alt="Heart Icon" />
                        <h2>My Subreddits</h2>
                    </header>
                    <ul>
                        {this.props.navItems.map(item => {
                            let find = this.props.subredditsAbout.filter(el => el.display_name === item);
                            if (find.length > 0) {
                                let { display_name, icon_img, title } = find[0];
                                let src = icon_img !== "" && icon_img !== null ? icon_img : defaultImg;
                                title = title !== "" && title !== null ? title : { display_name };
                                return (
                                    <Link to="/" key={display_name}>
                                        <li
                                            id="nav-item"
                                            title={title}
                                            style={this.props.highlightActive[0] === display_name ? { backgroundColor: 'rgba(211, 211, 211, 0.212)' } : { backgroundColor: 'white' }}
                                            onClick={() => {this.props.fetchPosts(`r/${display_name}.json`, display_name)}}
                                        >
                                            <img src={src} alt={display_name} />
                                            r/{display_name}
                                        </li>
                                    </Link>
                                );
                            } else {
                                return null;
                            }
                        })}
                    </ul>
                </section>
            </nav>
        );
    }
};