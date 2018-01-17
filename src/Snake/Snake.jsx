import React, { Component } from 'react';
import './Snake.css';

const INTERVAL = 100;
const BODY = 1;
const FOOD = 2;
const KEYS = {
  left: 37,
  up: 38,
  right: 39,
  down: 40,
};
const DIRS = {
  37: true,
  38: true,
  39: true,
  40: true,
};

function getNextIndex(head, direction, numRows, numCols) {
  let x = head % numCols;
  let y = Math.floor(head / numCols);

  switch (direction) {
    case KEYS.up:
      y = y <= 0 ? numRows - 1 : y - 1;
      break;
    case KEYS.down:
      y = y >= numRows - 1 ? 0 : y + 1;
      break;
    case KEYS.left:
      x = x <= 0 ? numCols - 1 : x - 1;
      break;
    case KEYS.right:
      x = x >= numCols - 1 ? 0 : x + 1;
      break;
    default:
      break;
  }

  return numCols * y + x;
}

class Snake extends Component {
  constructor(props) {
    super(props);
    this.state = this._initState();
  }

  componentDidMount() {
    this._resume();
    this.timerID = setInterval(() => this._tick(), INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  _initState = () => {
    const start = 0;
    const snake = [start];
    const board = [];
    board[start] = BODY;

    return {
      snake,
      board,
      growth: 0,
      paused: false,
      direction: KEYS.right,
    };
  };

  _reset = () => {
    this.setState(this._initState);
    this._resume();
    clearInterval(this.timerID);
    this.timerID = setInterval(() => this._tick(), INTERVAL);
  };

  _pause = () => {
    if (this.state.paused) {
      return;
    }
    this.setState({ paused: true });
  };

  _resume = () => {
    this.ref.focus();
    if (!this.state.paused) {
      return;
    }
    this.setState({ paused: false });
    this._tick();
  };

  _tick = () => {
    if (this.state.paused) {
      return;
    }
    const { snake, board } = this.state;
    let { growth, direction } = this.state;

    const numRows = this.props.numRows || 20;
    const numCols = this.props.numCols || 20;
    const head = getNextIndex(snake[0], direction, numRows, numCols);

    if (snake.indexOf(head) !== -1) {
      this.props.toggleSetup();
      return;
    }

    const needsFood = board[head] === FOOD || snake.length === 1;
    if (needsFood) {
      let ii;
      const numCells = numRows * numCols;
      do {
        ii = Math.floor(Math.random() * numCells);
      } while (board[ii]);
      board[ii] = FOOD;
      growth += 1;
    } else {
      board[snake.pop()] = null;
    }

    snake.unshift(head);
    board[head] = BODY;

    if (this._nextDirection) {
      direction = this._nextDirection;
      this._nextDirection = null;
    }

    this.setState({
      snake,
      board,
      growth,
      direction,
    });
  };

  _handleKey = (event) => {
    const direction = event.nativeEvent.keyCode;
    const difference = Math.abs(this.state.direction - direction);
    if (DIRS[direction] && difference !== 0 && difference !== 2) {
      this._nextDirection = direction;
    }
  };

  render() {
    const cells = [];
    const numRows = this.props.numRows || 20;
    const numCols = this.props.numCols || 20;
    const cellSize = 30;

    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const code = this.state.board[numCols * row + col];
        let type;
        if (code === BODY) {
          type = 'body';
        } else if (code === FOOD) {
          type = 'food';
        } else {
          type = 'null';
        }

        cells.push(<div key={`r-${row} c-${col}`} className={`${type}-cell`} />);
      }
    }

    return (
      <div className="snake-game">
        <h1 className="snake-len">Length: {this.state.snake.length}</h1>
        <div
          ref={(ref) => {
            this.ref = ref;
          }}
          className="snake-board"
          tabIndex={0}
          onBlur={this._pause}
          onFocus={this._resume}
          onKeyDown={this._handleKey}
          style={{ width: numCols * cellSize, height: numRows * cellSize }}
        >
          {cells}
        </div>
        <div className="snake-controls">
          {this.state.paused ? <button onClick={this._resume}>Resume</button> : null}
        </div>
      </div>
    );
  }
}

export default Snake;
