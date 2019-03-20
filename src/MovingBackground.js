import React, { Component } from 'react';
import { string, number } from 'prop-types';

const gsap = require('gsap');
const TweenLite = gsap.TweenLite;

function getWindowSize() {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
    };
}

export default class MovingBackground extends Component {
    static propTypes = {
        className: string,
        backgroundImageUrl: string,
        cssScale: number,
        translateFactor: number,
    };

    static defaultProps = {
        translateFactor: 10,
        cssScale: 1.1,
    };

    state = {
        positionX: 0,
        positionY: 0,
        windowWidth: getWindowSize().width,
        windowHeight: getWindowSize().height,
    };

    componentDidMount() {
        window.addEventListener('mousemove', this.onMouseMove);
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('mousemove', this.onMouseMove);
        window.removeEventListener('resize', this.onWindowResize);
    }

    componentDidUpdate(prevProps, prevState) {
        const { positionX, positionY } = this.state;
        if (
            prevState.positionX !== this.state.positionX ||
            prevState.positionY !== this.state.positionY
        ) {
            TweenLite.to(this.elementRef, 1, {
                x: -positionX,
                y: -positionY,
            });
        }
    }

    onMouseMove = event => {
        this.setPosition(event);
    };

    setPosition = event => {
        const { translateFactor } = this.props;
        const { windowWidth, windowHeight } = this.state;
        const mousePosition = {
            x: event.clientX,
            y: event.clientY,
        };

        this.setState({
            positionX: (mousePosition.x - windowWidth / 2) / translateFactor,
            positionY: (mousePosition.y - windowHeight / 2) / translateFactor,
        });
    };

    onWindowResize = () => {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    };

    render() {
        const { backgroundImageUrl } = this.props;

        return (
            <div
                className="movingBg"
                ref={element => (this.elementRef = element)}
                style={{
                    backgroundImage: `url(${backgroundImageUrl})`,
                }}
            />
        );
    }
}
