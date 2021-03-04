import React from 'react';

export class Options extends React.Component {
    render() {
        return (
            <header className="main-header">
                <section className="current-view">
                    {this.props.getSubreddit(this.props.activeSubreddit)}
                    <div className="change-view">
                        <div className="change hot">
                            <i className="fas fa-fire-alt"><span>Hot</span></i>
                        </div>
                        <div className="change top">
                            <i className="fas fa-medal"><span>Top</span></i>
                        </div>
                        <div className="change new">
                            <i className="fas fa-certificate"><span>New</span></i>
                        </div>
                    </div>
                </section>
                <section className="suggestions"></section>
            </header>
        )
    }
};