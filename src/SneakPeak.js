import React, { Component } from 'react';
import { string } from 'prop-types';
import ViprPlayer from './ViprPlayer';
import { videoShape } from './shapes';
import styles from './SneakPeak.module.css';

const gsap = require('gsap');

const TimelineLite = gsap.TimelineLite;
const TweenLite = gsap.TweenLite;

const initialContainerPosition = {
    width: '40%',
    height: 0,
    paddingBottom: '30%',
    left: '10%',
    top: '50%',
    xPercent: 10,
    yPercent: -50,
    transformOrigin: 'center',
    zIndex: 1,
    scaleX: 0.9,
    scaleY: 0.9,
};

function formatDuration(duration) {
    const pad = string => `0${string}`.slice(-2);

    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes}:${pad(seconds.toString())}`;
}

class SneakPeak extends Component {
    static propTypes = {
        bgColor: string,
        video: videoShape,
        direction: string,
    };

    state = {
        isFullscreen: false,
    };

    componentDidMount() {
        this.containerTween = new TimelineLite();
        this.containerTween.set(this.containerRef, initialContainerPosition);
        this.layerTween = new TimelineLite();
        this.titleTween = new TimelineLite();
        this.showContainer(this.props);

        window.addEventListener('mousemove', this.handleMouseMove);
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.video.id !== nextProps.video.id) {
            this.showContainer(nextProps);
        }
    }

    handleMouseMove = event => {
        const xPos = event.clientX / window.innerWidth - 0.5;
        const yPos = event.clientY / window.innerHeight - 0.5;

        if (!this.containerRef) {
            return;
        }

        TweenLite.to(this.containerRef, 0.5, {
            x: xPos * 50,
            y: yPos * 50,
        });
    };

    showContainer(props) {
        const { video, direction } = props;
        const { videoImageUrl } = video;
        const isNext = direction === 'next';

        this.containerTween.fromTo(
            this.containerRef,
            1,
            { xPercent: 5 },
            { xPercent: -5 }
        );

        this.layerTween
            .set(this.layerRef, {
                backgroundColor: this.props.bgColor,
                transform: 'rotate(-45deg) scale(2)',
                xPercent: isNext ? -150 : 150,
                yPercent: isNext ? -150 : 150,
            })
            .to(this.layerRef, 0.5, {
                xPercent: 0,
                yPercent: 0,
            })
            .to(this.containerRef, 0.3, {
                backgroundImage: `url(${videoImageUrl})`,
            })
            .to(this.layerRef, 0.5, {
                xPercent: isNext ? 150 : -150,
                yPercent: isNext ? 150 : -150,
            });

        this.titleTween.fromTo(
            this.titleRef,
            0.5,
            {
                x: 0,
                y: 400,
                opacity: 0,
            },
            {
                x: 0,
                y: 0,
                opacity: 1,
            }
        );
    }

    saveViprPlayerRef = element => {
        this.viprPlayerRef = element;
    };

    openFullscreen = () => {
        window.removeEventListener('mousemove', this.handleMouseMove);

        this.setState(
            {
                isFullscreen: true,
            },
            () => {
                this.containerTween
                    .set(this.viprPlayerRef, {
                        opacity: 0,
                    })
                    .to(this.containerRef, 0.5, {
                        filter: 'blur(20px)',
                        top: '50%',
                        left: '50%',
                        x: 0,
                        xPercent: -50,
                        yPercent: -50,
                        zIndex: 999,
                        scaleX: 1,
                        scaleY: 1,
                    })
                    .to(this.containerRef, 0.5, {
                        width: 'calc(100% - 100px)',
                        height: 'calc(100% - 100px)',
                    })
                    .to(this.containerRef, 0.5, {
                        filter: 'blur(0)',
                    })
                    .to(this.viprPlayerRef, 1, {
                        opacity: 1,
                    });
            }
        );
    };

    closeFullscreen = () => {
        this.setState(
            {
                isFullscreen: false,
            },
            () => {
                window.addEventListener('mousemove', this.handleMouseMove);
                this.containerTween.to(
                    this.containerRef,
                    0.5,
                    initialContainerPosition
                );
            }
        );
    };

    renderRegular(video) {
        return (
            <>
                <span className={styles.duration}>
                    {formatDuration(video.videoDuration)}
                </span>
                <button
                    onClick={this.openFullscreen}
                    className={styles.iconPlay}
                />
            </>
        );
    }

    renderFullscreen(video) {
        return (
            <>
                <ViprPlayer
                    containerId="vipr-video"
                    saveRef={this.saveViprPlayerRef}
                    video={video}
                />
                <button
                    onClick={this.closeFullscreen}
                    className={styles.close}
                />
            </>
        );
    }

    render() {
        const { video } = this.props;

        return (
            <>
                <h1
                    className={styles.title}
                    ref={title => (this.titleRef = title)}
                >
                    {video.title}
                </h1>
                <div
                    className={styles.container}
                    ref={div => (this.containerRef = div)}
                >
                    <div
                        className={styles.layer}
                        ref={div => (this.layerRef = div)}
                    />
                    {!this.state.isFullscreen && this.renderRegular(video)}
                    {this.state.isFullscreen && this.renderFullscreen(video)}
                </div>
            </>
        );
    }
}

export default SneakPeak;
