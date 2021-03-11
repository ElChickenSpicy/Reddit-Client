import React from 'react';
import * as dayjs from 'dayjs';

export class Posts extends React.Component {
    render() {
        //Dayjs setup
        const relativeTime = require('dayjs/plugin/relativeTime');
        dayjs.extend(relativeTime);

        return (
            <div id="posts">
                {this.props.initialPosts.map(post => {
                    return (
                        this.props.displayPost(post)
                    );
                })}
            </div>
        );
    }
};