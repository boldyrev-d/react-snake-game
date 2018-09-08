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

    const { toggleSetup } = this.props;
    toggleSetup();
  };

  render() {
    const { numCols, numRows, handleInputChange } = this.props;

    return (
      <div className="settings-page">
        <form className="settings-form" onSubmit={this.handleSubmit}>
          <h1 className="settings-title">
New game
          </h1>
          <label className="settings-label" htmlFor="numCols">
            Board width:
            <input
              className="settings-input"
              id="numCols"
              type="number"
              min="10"
              value={numCols}
              onChange={handleInputChange('numCols')}
              ref={(input) => {
                this.firstInput = input;
              }}
            />
          </label>
          <label className="settings-label" htmlFor="numRows">
            Board height:
            <input
              className="settings-input"
              id="numRows"
              type="number"
              min="10"
              value={numRows}
              onChange={handleInputChange('numRows')}
            />
          </label>
          <button className="settings-button" type="submit">
            Start
          </button>
        </form>
      </div>
    );
  }
}

export default Settings;
