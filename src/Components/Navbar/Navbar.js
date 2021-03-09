import React from 'react';
import { Link } from "react-router-dom";
import icon from '../../Icons/logoRelax.webp';
import hoverIcon from '../../Icons/logoRelaxHover.webp';
import defaultImg from '../../Icons/popular.webp';

export class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.hoverImage = this.hoverImage.bind(this);
    }

    //Hover effect on Relax icon
    hoverImage() {
        document.getElementById('normal').style.display === "none" ? document.getElementById('normal').style.display = "inline-block" : document.getElementById('normal').style.display = "none";
        document.getElementById('hoverImage').style.display === "none" ? document.getElementById('hoverImage').style.display = "inline-block" : document.getElementById('hoverImage').style.display = "none";
    }

    render() {
        return (
            <nav>
                <section className="branding">
                    <div className="form">
                        {/* On enter key, call the search function with the encoded text as the argument */}
                        <input
                            id="searchbar"
                            placeholder="Search Reddit..."
                            onKeyUp={({ key, target: { value } }) => {
                                if (key === "Enter") {
                                    this.props.search(`https://www.reddit.com/search.json?q=${encodeURI(value)}`, value);
                                    this.props.clearSearch('searchbar');
                                }
                            }}
                        />
                        <i className="fa fa-search"></i>
                    </div>

                    {/* Clicking the relax icon or text will return user to home screen and r/popular posts */}
                    <Link
                        to="/"
                        className="first40"
                        onClick={() => {
                            this.props.fetchSubredditData('popular');
                            this.props.fetchTop();
                        }}
                    >
                        <img id="normal" src={icon} alt="Icon" onMouseOver={() => this.hoverImage()} />
                        <img id="hoverImage" src={hoverIcon} alt="Icon" style={{ display: "none" }} onMouseLeave={() => this.hoverImage()} />
                        <h1 className="name">R</h1>
                        <h1 className="name">e</h1>
                        <h1 className="name">l</h1>
                        <h1 className="name">a</h1>
                        <h1 className="name">x</h1>
                    </Link>
                </section>

                {/* Display each of the users saved subreddits in the My Subreddits section */}
                <section className="subreddit-container">
                    <header className="subreddit-title">
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
                                    <Link to="/">
                                        <li
                                            id="nav-item"
                                            title={title}
                                            style={this.props.highlightActive[0] === display_name ? { backgroundColor: 'rgba(211, 211, 211, 0.212)' } : { backgroundColor: 'white' }}
                                            onClick={() => { this.props.fetchSubredditData(display_name) }}
                                        >
                                            <img src={src} alt={display_name} />
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