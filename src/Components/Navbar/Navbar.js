import React from 'react';
import { Link } from "react-router-dom";
import icon from '../../Icons/black.webp';
import defaultImg from '../../Icons/popular.webp';
import green from '../../Icons/green.webp';
import red from '../../Icons/red.webp';
import yellow from '../../Icons/yellow.webp';
import sand from '../../Icons/sand.webp';
import retroSearch from '../../Icons/retro-Search.png';
import heart from '../../Icons/heart.webp';

export class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            img: [green, red, yellow, sand],
            hover: 0
         };
        this.hoverImage = this.hoverImage.bind(this);
    }

    hoverImage() {
        this.setState({ hover: Math.floor(Math.random() * 4) });
        document.getElementById('normal').style.display === "none" ? document.getElementById('normal').style.display = "inline-block" : document.getElementById('normal').style.display = "none";
        document.getElementById('hoverImage').style.display === "none" ? document.getElementById('hoverImage').style.display = "inline-block" : document.getElementById('hoverImage').style.display = "none";
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
                        <img id="normal" src={icon} alt="Icon" onMouseOver={() => this.hoverImage()} />
                        <img id="hoverImage" src={this.state.img[this.state.hover]} alt="Icon" style={{ display: "none" }} onMouseLeave={() => this.hoverImage()} />
                        <h1 className="name">R</h1>
                        <h1 className="name">e</h1>
                        <h1 className="name">t</h1>
                        <h1 className="name">r</h1>
                        <h1 className="name">o</h1>
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