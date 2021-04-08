import { Link } from "react-router-dom";
import defaultImg from '../../Icons/popular.webp';
import { Searchbar } from "../Searchbar/Searchbar";

export const Options = ({ activeSubreddit, addSubreddit, fetchAboutData, fetchPosts, fetchTopSubreddits, getCurrentSubreddit, nav, searchSubreddits, searchTerm, top }) => {
    return (
        <div id="pseudoMainHeader">
            <div 
                id="collapsed-main-header"
                onClick={() => {
                    document.getElementById('collapsed-main-header').style.display = 'none';
                    document.getElementById('main-header').style.display = 'inline';
                    document.getElementById('pseudoMainHeader').style.width = '290px';

                    document.getElementById('collapsed-nav').style.display = 'inline';
                    document.getElementById('pseudoNav').style.width = '40px';
                    document.getElementById('nav').style.display = 'none';
                }}>
            </div>
            <header id="main-header">
                {getCurrentSubreddit(activeSubreddit)}
                <section className="suggestions">
                    <div className="subs-BG"></div>
                    <div className="top-title">
                        <Searchbar subs={true} method={searchSubreddits} />
                        <div className="top-header">
                            <h2>{searchTerm}</h2>
                        </div>
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
        </div>
    );
};