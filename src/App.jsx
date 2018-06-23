import React, { Component } from 'react';
import Snake from './Snake';
import Settings from './Settings';

class App extends Component {
  state = {
    setup: true,
    numCols: 20,
    numRows: 20,
  };

  toggleSetup = () => {
    this.setState(prevState => ({
      setup: !prevState.setup,
    }));
  };

  handleInputChange = field => (ev) => {
    this.setState({
      [field]: parseInt(ev.target.value, 10),
    });
  };

  render() {
    const { setup, numCols, numRows } = this.state;

    return (
      <div>
        {setup ? (
          <Settings
            handleInputChange={this.handleInputChange}
            toggleSetup={this.toggleSetup}
            numCols={numCols}
            numRows={numRows}
          />
        ) : (
          <Snake toggleSetup={this.toggleSetup} numCols={numCols} numRows={numRows} />
        )}
      </div>
    );
  }
}

export default App;
