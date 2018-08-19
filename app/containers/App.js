import React, { Component, PropTypes } from 'react';
import Header from '../components/Header';
import MainSection from '../components/MainSection';
import style from './App.css';

const port = chrome.runtime.connect();

export default class App extends Component {
  constructor() {
    super();

    this.state = { balance: undefined };
    this.setBalance = this.setBalance.bind(this);
  }

  componentDidMount() {
    port.onMessage.addListener(({ balance }) => {
      this.setBalance(balance)
    });
  }

  setBalance(balance) {
    this.setState({ balance });
  }

  render() {
    const { balance } = this.state;

    return (
      <div className={style.wrapper}>
        <Header />
        <MainSection balance={balance} />
      </div>
    );
  }
}
