import { Link } from "react-router-dom";
import defaultImg from '../../Icons/popular.webp';
import burger from '../../Icons/burger.webp';
import { Searchbar } from "../Searchbar/Searchbar";

export const Options = ({ activeSubreddit, addSubreddit, fetchAboutData, fetchPosts, fetchTopSubreddits, hideElement, getCurrentSubreddit, nav, searchSubreddits, searchTerm, showElement, top, updateMobileNavigation}) => {

    if (matchMedia) {
        const mqTablet = window.matchMedia("(min-width: 1150px)");
        mqTablet.addEventListener("change", () => {
            tabletChange(mqTablet);
        });

        const mqPhone = window.matchMedia("(max-width: 800px)");
        mqPhone.addEventListener("change", () => {
            phoneChange(mqPhone);
        });
    }

    function phoneChange(mq) {
        if (mq.matches) {
            hideElement(['collapsed-main-header', 'pseudo-collapsed-main-header', 'main-header', 'pseudoMainHeader']);
        }
    }

    function tabletChange(mq) {
        if (mq.matches) {
            showMain();
        }
    }

    function showMain() {
        hideElement(['collapsed-main-header', 'pseudo-collapsed-main-header']);
        showElement(['main-header', 'pseudoMainHeader']);
    }

    function hideNav() {
        showElement(['collapsed-nav', 'pseudo-collapsed-nav']);
        hideElement(['pseudoNav', 'nav']);
    }

    return (
        <>
            <div id="pseudo-collapsed-main-header">
                <div
                    id="collapsed-main-header"
                    onClick={() => {
                        showMain();
                        hideNav();
                    }}
                >
                    <img src={burger} title="Toggle Menu" alt="Menu Icon" />
                </div>
            </div>

            <div id="pseudoMainHeader">
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
                                                    updateMobileNavigation('home');
                                                    fetchPosts({
                                                        query: `r/${display_name}.json`,
                                                        active: display_name
                                                    });
                                                    fetchAboutData(display_name);
                                                    fetchTopSubreddits();
                                                    if (matchMedia) {
                                                        if (window.matchMedia("(max-width: 800px)").matches) {
                                                            document.querySelector('main').style.display = 'flex';
                                                            showElement(['mobile-header']);
                                                            hideElement(['pseudoMainHeader', 'main-header']);
                                                        }
                                                    }
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

            <div id="mobile-header">
                <Searchbar subs={false} method={fetchPosts} />
                <div className="mobile-divider">
                    {getCurrentSubreddit(activeSubreddit)}
                </div>
            </div>
        </>
    );
};