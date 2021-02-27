import React from 'react';

export class Options extends React.Component {
    render() {
        return (
            <header className="main-header">
                    {/* Desktop View
                    <div id="main-subreddit"> */}
                        {/* If the below subreddit isn't included in state.nav, display a button with a + sign, otherwise display a minus sign */}
                        {/* Also, some formatting for if it is Search Results */}
                        {/* {this.props.subreddit.startsWith("Search Results") ?
                            <h2>{this.props.subreddit}</h2> :
                            this.props.navItems.includes(this.props.subreddit) === true ?
                                <figure>
                                    <h2>r/{this.props.subreddit}</h2>
                                    <button className="remove" onClick={() => this.props.removeSubreddit(this.props.subreddit)}>X</button>
                                    <figcaption>
                                        <p id="informational">Remove this subreddit from your Navigation Bar</p>
                                    </figcaption>
                                </figure> :
                                <figure>
                                    <h2>r/{this.props.subreddit}</h2>
                                    <button className="add" onClick={() => this.props.addSubreddit(this.props.subreddit)}>+</button>
                                    <figcaption>
                                        <p id="informational">Add this subreddit to your Navigation Bar</p>
                                    </figcaption>
                                </figure>
                        }
                    </div> */}

                    {/* Mobile View */}
                    {/* <select>
                        <option value="0">r/All</option>
                        <option value="1">r/soccer</option>
                        <option value="2">r/ProgrammerHumor</option>
                        <option value="3">r/coolguides</option>
                        <option value="4">r/dataisbeautiful</option>
                        <option value="5">r/ABoringDystopia</option>
                    </select>
                    <input placeholder="Search..." /> */}
                </header>
        )
    }
};