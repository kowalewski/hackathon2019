import React, { Component } from 'react';
import { string, shape, func } from 'prop-types';

import { videoShape } from './shapes';
import vipr from '@startsiden/vipr-player';

export class ViprPlayer extends Component {
    static propTypes = {
        containerId: string.isRequired,
        video: shape(videoShape),
        saveRef: func,
    };

    componentDidMount() {
        this.videoInit(this.props);
    }

    shouldComponentUpdate(nextProps) {
        return false;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.video !== nextProps.video) {
            this.videoInit(this.props);
        }
    }

    componentWillUnmount() {
        this.unload();
    }

    getPlugins = () => {
        return {
            plugins: {},
        };
    };

    getViprOptions() {
        return {
            autoplay: true,
            width: '100%',
            jwPlayerId: 'DEjjzsZF',
            controls: false,
        };
    }

    videoInit = props => {
        const { video, containerId } = props;

        vipr.player(
            containerId,
            video,
            this.getViprOptions(),
            this.getPlugins()
        );
    };

    unload() {
        vipr.player(this.props.containerId).unload();
    }

    render() {
        return (
            <div
                id={this.props.containerId}
                className="vipr-player"
                ref={this.props.saveRef}
            />
        );
    }
}

export default ViprPlayer;
