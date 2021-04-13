import { Link } from "react-router-dom";
import icon from '../../Icons/black.webp';
import defaultImg from '../../Icons/popular.webp';
import burger from '../../Icons/burger.webp';
import heart from '../../Icons/heart.webp';
import home from '../../Icons/home.webp';
import earth from '../../Icons/earth.webp';
import { Searchbar } from "../Searchbar/Searchbar";

export const Navbar = ({ fetchPosts, fetchTopSubreddits, highlightActive, navItems, subredditsAbout }) => {
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
            document.getElementById('collapsed-nav').style.display = 'none';
            document.getElementById('pseudo-collapsed-nav').style.display = 'none';
            document.getElementById('pseudoNav').style.display = 'none';
            document.getElementById('nav').style.display = 'none';

            document.getElementById('mobile-navigation').style.display = 'flex';
        } else {
            showNav();
            hideMain();
            document.getElementById('mobile-navigation').style.display = 'none';
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
        document.getElementById('collapsed-nav').style.display = 'none';
        document.getElementById('pseudo-collapsed-nav').style.display = 'none';
        document.getElementById('pseudoNav').style.display = 'inline';
        document.getElementById('nav').style.display = 'inline';
    }

    function hideMain() {
        document.getElementById('collapsed-main-header').style.display = 'flex';
        document.getElementById('pseudo-collapsed-main-header').style.display = 'inline';
        document.getElementById('main-header').style.display = 'none';
        document.getElementById('pseudoMainHeader').style.display = 'none';
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
                                                })
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
                <Link
                    to="/"
                    className="mobile-nav-item"
                    onClick={() => {
                        fetchPosts({
                            query: 'r/popular.json',
                            active: 'popular'
                        });
                        fetchTopSubreddits();
                    }}
                >
                    <img src={home} title="Home" alt="Home icon" />
                </Link>
                <div className="mobile-nav-item"><img src={heart} title="My Subreddits" alt="Heart icon" /></div>
                <div className="mobile-nav-item"><img src={earth} title="Top Subreddits" alt="Earth icon" /></div>
            </div>
        </>
    );
};