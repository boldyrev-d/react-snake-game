import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './Settings.css';

class Settings extends Component {
  static propTypes = {
    numCols: PropTypes.number.isRequired,
    numRows: PropTypes.number.isRequired,
    handleInputChange: PropTypes.func.isRequired,
    toggleSetup: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.firstInput.focus();
  }

  handleSubmit = (ev) => {
    ev.preventDefault();
    this.props.toggleSetup();
  };

  render() {
    return (
      <div className="settings-page">
        <form className="settings-form" onSubmit={this.handleSubmit}>
          <h1 className="settings-title">New game</h1>
          <label className="settings-label">
            Board width:
            <input
              className="settings-input"
              type="number"
              min="10"
              value={this.props.numCols}
              onChange={this.props.handleInputChange('numCols')}
              ref={(input) => {
                this.firstInput = input;
              }}
            />
          </label>
          <label className="settings-label">
            Board height:
            <input
              className="settings-input"
              type="number"
              min="10"
              value={this.props.numRows}
              onChange={this.props.handleInputChange('numRows')}
            />
          </label>
          <button className="settings-button">Start</button>
        </form>
      </div>
    );
  }
}

export default Settings;
