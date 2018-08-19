import React, { Component, PropTypes, Fragment } from 'react';
import style from './MainSection.css';

export default class MainSection extends Component {
  constructor(props) {
    super(props);

    this.state = {
      account: '',
      balance: props.balance 
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    chrome.storage.local.get('account', (obj) => {
      this.setAccount(obj);
    });
  }

  componentWillReceiveProps({ balance }) {
    if (balance) {
      this.setState({ balance });
    }
  }

  setAccount({ account }) {
    this.setState({ account })
  }

  handleSubmit(event) {
    const { account } = this.state;

    chrome.runtime.sendMessage({ account }, ({ balance }) => {
      this.setState({ balance });
    });

    event.preventDefault();
  }

  handleChange(event) {
    this.setState({ account: event.target.value });
  }

  render() {
    const { balance, account } = this.state;

    return (
      <div className={style.wrapper}>
        <div className={style.header}>
          { balance &&
            <h1 className={style.title}>
              { new Intl.NumberFormat().format(balance) }
              <small>VTHO</small>
            </h1>
          }
          { !balance && account && <h2>Loading...</h2> }
        </div>
        { !balance && !account && <small className={style.label}>Please enter your public address</small> }
        <form className={style.form} onSubmit={this.handleSubmit}>
          <input 
            type="text" 
            value={this.state.account} 
            onChange={this.handleChange} 
            placeholder="Account #"/>
          <div className={style.formFooter}>
            <input type="submit" value="Save" />
          </div>
        </form>
      </div>
    );
  }
}
