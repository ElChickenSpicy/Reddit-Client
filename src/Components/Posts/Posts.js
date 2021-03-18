import React from 'react';
import * as dayjs from 'dayjs';

export class Posts extends React.Component {
    render() {
        const relativeTime = require('dayjs/plugin/relativeTime');
        dayjs.extend(relativeTime);
        return (
            <div id="posts">
                {this.props.displayPost(this.props.post, this.props.i)}
            </div>
        );
    }
};