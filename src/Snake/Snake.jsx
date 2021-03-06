import React, { Component } from 'react';
import PropTypes from 'prop-types';
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
  static propTypes = {
    numCols: PropTypes.number.isRequired,
    numRows: PropTypes.number.isRequired,
    toggleSetup: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = this.initState();
  }

  componentDidMount() {
    this.resume();
    this.timerID = setInterval(() => this.tick(), INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  initState = () => {
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

  reset = () => {
    this.setState(this.initState);
    this.resume();
    clearInterval(this.timerID);
    this.timerID = setInterval(() => this.tick(), INTERVAL);
  };

  pause = () => {
    const { paused } = this.state;

    if (paused) return;
    this.setState({ paused: true });
  };

  resume = () => {
    const { paused } = this.state;

    this.ref.focus();
    if (!paused) return;
    this.setState({ paused: false });
    this.tick();
  };

  tick = () => {
    const { paused } = this.state;
    const { numRows: numRowsFromSettings, numCols: numColsFromSettings, toggleSetup } = this.props;

    if (paused) return;

    const { snake, board } = this.state;
    let { growth, direction } = this.state;

    const numRows = numRowsFromSettings || 20;
    const numCols = numColsFromSettings || 20;
    const head = getNextIndex(snake[0], direction, numRows, numCols);

    if (snake.indexOf(head) !== -1) {
      toggleSetup();
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

    if (this.nextDirection) {
      direction = this.nextDirection;
      this.nextDirection = null;
    }

    this.setState({
      snake,
      board,
      growth,
      direction,
    });
  };

  handleKey = (event) => {
    const { direction: currentDirection } = this.state;

    const direction = event.nativeEvent.keyCode;
    const difference = Math.abs(currentDirection - direction);
    if (DIRS[direction] && difference !== 0 && difference !== 2) {
      this.nextDirection = direction;
    }
  };

  render() {
    const { board, snake, paused } = this.state;
    const { numRows: numRowsFromSettings, numCols: numColsFromSettings } = this.props;

    const cells = [];
    const numRows = numRowsFromSettings || 20;
    const numCols = numColsFromSettings || 20;
    const cellSize = 30;

    for (let row = 0; row < numRows; row += 1) {
      for (let col = 0; col < numCols; col += 1) {
        const code = board[numCols * row + col];
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
        <h1 className="snake-len">
          Length:
          {snake.length}
        </h1>
        <div
          ref={(ref) => {
            this.ref = ref;
          }}
          className="snake-board"
          tabIndex={0}
          onBlur={this.pause}
          onFocus={this.resume}
          onKeyDown={this.handleKey}
          style={{ width: numCols * cellSize, height: numRows * cellSize }}
        >
          {cells}
        </div>
        <div className="snake-controls">
          {paused ? (
            <button onClick={this.resume} type="submit">
              Resume
            </button>
          ) : null}
        </div>
      </div>
    );
  }
}

export default Snake;
