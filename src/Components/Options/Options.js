import { Link } from "react-router-dom";
import defaultImg from '../../Icons/popular.webp';
import retroSearch from '../../Icons/retro-Search.png';

export const Options = ({ activeSubreddit, addSubreddit, clearSearch, fetchAboutData, fetchPosts, fetchTopSubreddits, getCurrentSubreddit, nav, searchSubs, searchTerm, top }) => {
    return (
        <header className="main-header">
            {getCurrentSubreddit(activeSubreddit)}
            <section className="suggestions">
                <div className="top-title">
                    <div id="SSform" className="form">
                        <input
                            id="SSsearchbar"
                            placeholder="Search Reddit..."
                            onKeyUp={({ key, target: { value } }) => {
                                if (key === "Enter") {
                                    searchSubs(`subreddits/search.json?q=${encodeURI(value)}`, value);
                                    clearSearch('SSsearchbar');
                                }
                            }}
                        />
                        <div id="SScontainer" className="search-container">
                            <img id="SSicon" className="search-icon" src={retroSearch} alt="Searchbar Icon" />
                        </div>
                    </div>
                    <div className="top-header">
                        <h2>{searchTerm}</h2>
                    </div>
                    <div className="subs-BG"></div>
                </div>
                <ul className="SSul">
                    {top.map(({ data: { display_name, icon_img, title } }) => {
                        const src = icon_img || defaultImg;
                        title = title || display_name;
                        return (
                            <div className="returnedLI" key={display_name}>
                                <div className="add-to-nav">
                                    {nav.includes(display_name) ? '' :
                                        <i
                                            className="fas fa-plus"
                                            title="Add this subreddit to your Navigation Bar"
                                            onClick={() => addSubreddit(display_name)}
                                        >
                                        </i>}
                                </div>
                                <Link to="/">
                                    <li
                                        id="nav-item"
                                        title={title}
                                        onClick={() => {
                                            fetchPosts({
                                                query: `r/${display_name}.json`,
                                                active: display_name
                                            });
                                            fetchAboutData(display_name);
                                            fetchTopSubreddits();
                                        }}>
                                        <img src={src} alt={display_name} />
                                                r/{display_name}
                                    </li>
                                </Link>
                            </div>
                        );
                    })}
                </ul>
            </section>
        </header>
    );
};