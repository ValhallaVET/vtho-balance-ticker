import React, { PropTypes, Component } from 'react';
import styles from './Header.css';

export default class Header extends Component {
  static propTypes = {
  };

  constructor() {
    super();

    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
  }

  open() {
    chrome.tabs.create({ url: 'http://reddit.com/r/vechain' })
  }

  close() {
    window.close();
  }

  render() {
    return (
      <header className={styles.wrapper}>
        <div className={styles.links}>
          <button className={styles.link} onClick={this.open}>
            <small>
              r/vechain
            </small>
          </button>
        </div>
        <div className={styles.actions}>
          <button className={styles.link} onClick={this.close}>
            <small>
              close
            </small>
          </button>
        </div>
      </header>
    );
  }
}
