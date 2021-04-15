import { Link } from "react-router-dom";
import icon from '../../Icons/black.webp';
import defaultImg from '../../Icons/popular.webp';
import burger from '../../Icons/burger.webp';
import heart from '../../Icons/heart.webp';
import home from '../../Icons/home.webp';
import earth from '../../Icons/earth.webp';
import back from '../../Icons/back.webp';
import { Searchbar } from "../Searchbar/Searchbar";

export const Navbar = ({ fetchPosts, fetchTopSubreddits, hideElement, highlightActive, mobileNavigation, navItems, saveScrollPosition, setScrollPosition, showElement, subredditsAbout, updateMobileNavigation }) => {
    const name = 'Retro';
    const colors = ['#ff2941', '#fe18d3', '#4206f1', '#74ee15', '#4deeea'];

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
            hideElement(['collapsed-nav', 'pseudo-collapsed-nav', 'pseudoNav', 'nav']);
            showElement(['mobile-navigation', 'mobile-header']);
        } else {
            showNav();
            hideMain();
            hideElement(['mobile-navigation', 'mobile-header']);
            document.querySelector('main').style.display = 'flex';
        }
    }

    function tabletChange(mq) {
        if (mq.matches) {
            showNav();
        } else {
            hideMain();
        }
    }

    function showNav() {
        hideElement(['collapsed-nav', 'pseudo-collapsed-nav']);
        showElement(['pseudoNav', 'nav']);
    }

    function hideMain() {
        showElement(['collapsed-main-header', 'pseudo-collapsed-main-header']);
        hideElement(['main-header', 'pseudoMainHeader']);

    }

    return (
        <>
            <div id="pseudo-collapsed-nav">
                <div
                    id="collapsed-nav"
                    onClick={() => {
                        hideMain();
                        showNav();
                    }}
                >
                    <img src={burger} title="Toggle Menu" alt="Menu Icon" />
                </div>
            </div>

            <div id="pseudoNav">
                <nav id="nav">
                    <section className="branding">
                        <Searchbar subs={false} method={fetchPosts} />
                        <Link
                            to="/"
                            className="first40"
                            onClick={() => {
                                fetchPosts({
                                    query: 'r/popular.json',
                                    active: 'popular'
                                });
                                fetchTopSubreddits();
                            }} >
                            <img
                                id="I"
                                src={icon}
                                alt="Icon"
                                onMouseEnter={({ target: { id } }) => document.getElementById(id).style.backgroundColor = colors[Math.floor(Math.random() * 5)]}
                                onMouseLeave={({ target: { id } }) => document.getElementById(id).style.backgroundColor = '#888'}
                            />
                            {[...name].map((letter, i) => {
                                return (
                                    <h1
                                        key={letter + i}
                                        id={letter}
                                        className="name"
                                        onMouseEnter={({ target: { id } }) => document.getElementById(id).style.color = colors[Math.floor(Math.random() * 5)]}
                                        onMouseLeave={({ target: { id } }) => document.getElementById(id).style.color = 'black'}>
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
                            {navItems.map(item => {
                                let find = subredditsAbout.filter(el => el.display_name === item);
                                if (find.length <= 0) return null;
                                let { display_name, icon_img, title } = find[0];
                                let src = icon_img || defaultImg;
                                title = title || display_name;
                                return (
                                    <Link to="/" key={display_name}>
                                        <li
                                            id="nav-item"
                                            title={title}
                                            style={highlightActive[0] === display_name ? { backgroundColor: 'rgba(211, 211, 211, 0.212)' } : { backgroundColor: 'white' }}
                                            onClick={() => {
                                                fetchPosts({
                                                    query: `r/${display_name}.json`,
                                                    active: display_name
                                                });
                                                if (matchMedia) {
                                                    if (window.matchMedia("(max-width: 800px)").matches) {
                                                        updateMobileNavigation('home');
                                                        showElement(['mobile-header']);
                                                        document.querySelector('main').style.display = 'flex';
                                                        hideElement(['pseudoNav', 'nav'])
                                                    }
                                                }
                                            }} >
                                            <img src={src} alt={display_name} />
                                    r/{display_name}
                                        </li>
                                    </Link>
                                );
                            })}
                        </ul>
                    </section>
                </nav>
            </div>

            <div id="mobile-navigation">
                {mobileNavigation === 'home' ? '' : 
                <Link
                    to="/"
                    className="mobile-nav-item"
                    onClick={() => {
                        updateMobileNavigation('home');
                        showElement(['mobile-header']);
                        document.querySelector('main').style.display = 'flex';
                        hideElement(['pseudoNav', 'nav', 'pseudoMainHeader', 'main-header']);
                        setTimeout(() => setScrollPosition(), 0);
                    }}
                >
                    <img src={back} title="Back" alt="" />
                </Link>
                }
                <Link
                    to="/"
                    className="mobile-nav-item"
                    onClick={() => {
                        fetchPosts({
                            query: 'r/popular.json',
                            active: 'popular'
                        });
                        updateMobileNavigation('home');
                        fetchTopSubreddits();
                        showElement(['mobile-header']);
                        document.querySelector('main').style.display = 'flex';
                        hideElement(['pseudoNav', 'nav', 'pseudoMainHeader', 'main-header']);
                    }}
                >
                    <img src={home} title="Home" alt="Home icon" />
                </Link>
                <Link
                    to='/'
                    className="mobile-nav-item"
                    onClick={() => {
                        saveScrollPosition();
                        updateMobileNavigation('MySubreddits');
                        document.querySelector('main').style.display = 'none';
                        showElement(['pseudoNav', 'nav']);
                        hideElement(['mobile-header', 'pseudoMainHeader', 'main-header']);
                    }}>
                    <img src={heart} title="My Subreddits" alt="Heart icon" />
                </Link>
                <Link
                    to='/'
                    className="mobile-nav-item"
                    onClick={() => {
                        saveScrollPosition();
                        updateMobileNavigation('TopSubreddits');
                        document.querySelector('main').style.display = 'none';
                        showElement(['pseudoMainHeader', 'main-header'])
                        hideElement(['mobile-header', 'pseudoNav', 'nav'])
                    }}>
                    <img src={earth} title="Top Subreddits" alt="Earth icon" />
                </Link>
            </div>
        </>
    );
};