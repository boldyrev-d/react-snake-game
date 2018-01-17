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
    this.setState({
      setup: !this.state.setup,
    });
  };

  handleInputChange = field => (ev) => {
    this.setState({
      [field]: parseInt(ev.target.value, 10),
    });
  };

  render() {
    return (
      <div>
        {this.state.setup ? (
          <Settings
            handleInputChange={this.handleInputChange}
            toggleSetup={this.toggleSetup}
            numCols={this.state.numCols}
            numRows={this.state.numRows}
          />
        ) : (
          <Snake
            toggleSetup={this.toggleSetup}
            numCols={this.state.numCols}
            numRows={this.state.numRows}
          />
        )}
      </div>
    );
  }
}

export default App;
