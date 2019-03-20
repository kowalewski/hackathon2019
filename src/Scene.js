import React, { Component } from 'react';
import { string } from 'prop-types';

import { videoShape } from './shapes';
import MovingBackground from './MovingBackground';
import SneakPeak from './SneakPeak';

import styles from './Scene.module.css';

class Scene extends Component {
    static propTypes = {
        video: videoShape,
        bgColor: string,
        direction: string,
    };

    render() {
        const { bgColor, video, direction } = this.props;

        return (
            <div className={styles.scene}>
                <MovingBackground backgroundImageUrl={video.videoImageUrl} />
                <SneakPeak
                    video={video}
                    direction={direction}
                    bgColor={bgColor}
                />
            </div>
        );
    }
}

export default Scene;
