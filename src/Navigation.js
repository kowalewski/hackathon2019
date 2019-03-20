import React, { Component } from 'react';
import { number } from 'prop-types';
import styles from './Navigation.module.css';

class Navigation extends Component {
    static propTypes = {
        total: number,
        active: number,
    };

    render() {
        return (
            <div className={styles.container}>
                {this.props.active} / {this.props.total}
            </div>
        );
    }
}

export default Navigation;
