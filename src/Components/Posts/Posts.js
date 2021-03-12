import React from 'react';
import * as dayjs from 'dayjs';

export class Posts extends React.Component {
    render() {
        const relativeTime = require('dayjs/plugin/relativeTime');
        dayjs.extend(relativeTime);

        return (
            <div id="posts">
                {this.props.initialPosts.map((post, i) => {
                    return (
                        this.props.displayPost(post, i)
                    );
                })}
            </div>
        );
    }
};