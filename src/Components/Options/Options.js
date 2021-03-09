import React from 'react';
import { Link } from "react-router-dom";

export class Options extends React.Component {
    render() {
        return (
            <header className="main-header">
                {this.props.getSubreddit(this.props.activeSubreddit)}
                <section className="suggestions">
                    <div className="top-title">

                        <div id="SSform" className="form">
                            {/* When the user inputs info to the searchbar and hits enter, 
                            encode the text and call the search function with the text as the argument */}
                            <input
                                id="SSsearchbar"
                                placeholder="Search Reddit..."
                                onKeyUp={({ key, target: { value } }) => {
                                    if (key === "Enter") {
                                        this.props.searchSubs(`https://www.reddit.com/subreddits/search.json?q=${encodeURI(value)}`, value);
                                        this.props.clearSearch('SSsearchbar');
                                    }
                                }}
                            />
                            <i id="SSicon" className="fa fa-search"></i>
                        </div>
                        <div className="top-header">
                            <h2>{this.props.searchTerm}</h2>
                        </div>

                    </div>
                    <ul>
                        {this.props.top.map(({data: { display_name, icon_img, title }}) => {
                            let src = icon_img !== "" && icon_img !== null ? icon_img : "subreddit/popular.webp";
                            title = title !== "" && title !== null ? title : { display_name };
                            return (
                                <Link to="/">
                                    <li
                                    id="nav-item"
                                    title={title}
                                    onClick={() => { 
                                        this.props.fetchAbout(display_name)
                                        this.props.fetchSubredditData(display_name)
                                    }}>
                                        <img src={src} alt={display_name}/>
                                        r/{display_name}
                                    </li>
                                </Link>
                            );
                        })}    
                    </ul>
                </section>
            </header>
        );
    }
};