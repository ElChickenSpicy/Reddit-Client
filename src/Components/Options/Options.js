import React from 'react';

export class Options extends React.Component {
    render() {
        return (
            <header className="main-header">
                {this.props.getSubreddit(this.props.activeSubreddit)}
                <section className="suggestions"></section>
            </header>
        );
    }
};