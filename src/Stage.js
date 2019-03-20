import React, { Component } from 'react';
import { arrayOf } from 'prop-types';
import throttle from 'lodash/throttle';
import prefetchImages from 'prefetch-image';

import { videoShape } from './shapes';
import Scene from './Scene';
import Navigation from './Navigation';

import styles from './Stage.module.css';

const gsap = require('gsap');
const TimelineLite = gsap.TimelineLite;

const colors = [
    '#5DD9C1',
    '#ACFCD9',
    '#B084CC',
    '#665687',
    '#190933',
    '#F4F1DE',
    '#E07A5F',
    '#3D405B',
    '#81B29A',
    '#F2CC8F',
    '#39CCCC',
    '#01FF70',
    '#FFDC00',
    '#FF851B',
    '#FF4136',
];

function getRandomColor(array) {
    return array[Math.floor(Math.random() * array.length)];
}

class Stage extends Component {
    static propTypes = {
        items: arrayOf(videoShape),
    };

    state = {
        activeSceneIndex: 0,
        bgColor: getRandomColor(colors),
    };

    componentDidMount() {
        this.stageTween = new TimelineLite();
        document.addEventListener('keyup', throttle(this.handleKeyUp, 300));
        const images = this.props.items.map(item => item.videoImageUrl);
        prefetchImages(images).then(result => {
            this.stageTween.to(this.layerRef, 0.3, {
                yPercent: -100,
            });
        });
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.bgColor !== this.state.bgColor) {
            this.stageTween.to(this.stageRef, 0.3, {
                backgroundColor: prevState.bgColor,
            });
        }
    }

    setActiveScene = ({ activeSceneIndex, direction }) => {
        this.setState({
            activeSceneIndex,
            direction,
            bgColor: getRandomColor(colors),
        });
    };

    handleKeyUp = event => {
        switch (event.keyCode) {
            case 38:
                this.onArrowUp();
                break;
            case 40:
                this.onArrowDown();
                break;
            default:
                break;
        }
    };

    onArrowUp() {
        const itemsLength = this.props.items.length;
        const activeSceneIndex = this.state.activeSceneIndex + 1;

        if (activeSceneIndex >= itemsLength) {
            this.nono();
            return;
        }

        this.setActiveScene({ activeSceneIndex, direction: 'next' });
    }

    onArrowDown() {
        const activeSceneIndex = this.state.activeSceneIndex - 1;

        if (activeSceneIndex < 0) {
            this.nono();
            return;
        }

        this.setActiveScene({ activeSceneIndex, direction: 'prev' });
    }

    nono() {
        this.stageTween
            .to(this.stageRef, 0.1, {
                x: -50,
            })
            .to(this.stageRef, 0.1, {
                x: 50,
            })
            .to(this.stageRef, 0.1, {
                x: -50,
            })
            .to(this.stageRef, 0.1, {
                x: 50,
            })
            .to(this.stageRef, 0.1, {
                x: 0,
            });
    }

    render() {
        const { bgColor, activeSceneIndex, direction } = this.state;
        const item = this.props.items[activeSceneIndex];

        return (
            <div className={styles.stage} ref={div => (this.stageRef = div)}>
                <Navigation
                    active={this.state.activeSceneIndex + 1}
                    total={this.props.items.length}
                />
                <div
                    className={styles.layer}
                    ref={div => (this.layerRef = div)}
                />
                <Scene video={item} direction={direction} bgColor={bgColor} />
            </div>
        );
    }
}

export default Stage;
