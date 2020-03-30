import React, { Component } from 'react';

const CANVAS_BORDER_COLOUR = 'black';
const CANVAS_BACKGROUND_COLOUR = 'white';
const SNAKE_BORDER_COLOUR = 'red';
const SNAKE_BACKGROUND_COLOUR = 'blue';
const FOOD_BORDER_COLOUR = 'orange';
const FOOD_BACKGROUND_COLOUR = 'yellow';

const SNAKE_SIZE = {
  x: 10,
  y: 10,
};

const DIRECTIONS = {
  LEFT: [-10, 0],
  RIGHT: [10, 0],
  UP: [0, -10],
  DOWN: [0, 10],
};

class Snake extends Component {
  state = {
    snake: [
      { x: 150, y: 150 },
      { x: 140, y: 150 },
      { x: 130, y: 150 },
      { x: 120, y: 150 },
      { x: 110, y: 150 },
    ],
    direction: DIRECTIONS.RIGHT,
    foodX: null,
    foodY: null,
  };

  componentDidMount() {
    this.drawBoard();
    this.drawSnake();
    this.drawFood();
  }

  componentDidUpdate(prevProps, prevState) {
    this.drawBoard();
    this.drawSnake();
    this.drawFood();
  }

  drawBoard = () => {
    const ctx = this.canvas.getContext('2d');
    const canvasElement = this.canvas;

    ctx.fillStyle = CANVAS_BACKGROUND_COLOUR;
    ctx.strokeStyle = CANVAS_BORDER_COLOUR;

    ctx.fillRect(0, 0, canvasElement.width, canvasElement.height);
    ctx.strokeRect(0, 0, canvasElement.width, canvasElement.height);
  };

  drawSnakePart = (snakePart) => {
    const ctx = this.canvas.getContext('2d');

    ctx.fillStyle = SNAKE_BACKGROUND_COLOUR;
    ctx.strokeStyle = SNAKE_BORDER_COLOUR;

    ctx.fillRect(snakePart.x, snakePart.y, SNAKE_SIZE.x, SNAKE_SIZE.y);
    ctx.strokeRect(snakePart.x, snakePart.y, SNAKE_SIZE.x, SNAKE_SIZE.y);
  };

  drawSnake = () => {
    const { snake } = this.state;

    snake.forEach(this.drawSnakePart);
  };

  drawFood = () => {
    let x;
    let y;
    const ctx = this.canvas.getContext('2d');
    const { foodX, foodY } = this.state;

    if (foodX && foodY) {
      [x, y] = [foodX, foodY];
    } else {
      [x, y] = this.generateFood();
      this.setState({ foodX: x, foodY: y });
    }

    ctx.fillStyle = FOOD_BACKGROUND_COLOUR;
    ctx.strokeStyle = FOOD_BORDER_COLOUR;
    ctx.fillRect(x, y, 10, 10);
    ctx.strokeRect(x, y, 10, 10);
  };

  moveSnake = (direction) => {
    const { snake, foodX, foodY } = this.state;
    const head = { x: snake[0].x + direction[0], y: snake[0].y + direction[1] };

    snake.unshift(head);

    const didEatFood = snake[0].x === foodX && snake[0].y === foodY;
    if (didEatFood) {
      this.setState({ foodX: null, foodY: null });
      this.drawFood();
    } else {
      snake.pop();
    }

    this.setState({ snake });
  };

  handleKeyPress = (event) => {
    const { direction } = this.state;

    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;
    const keyPressed = event.keyCode;

    const goingRight = direction === DIRECTIONS.RIGHT;
    const goingLeft = direction === DIRECTIONS.LEFT;
    const goingUp = direction === DIRECTIONS.UP;
    const goingDown = direction === DIRECTIONS.DOWN;

    let moveSnakeDirection;

    if (keyPressed === LEFT_KEY && !goingRight) {
      this.setState({ direction: DIRECTIONS.LEFT });
      moveSnakeDirection = DIRECTIONS.LEFT;
    } else if (keyPressed === RIGHT_KEY && !goingLeft) {
      this.setState({ direction: DIRECTIONS.RIGHT });
      moveSnakeDirection = DIRECTIONS.RIGHT;
    } else if (keyPressed === DOWN_KEY && !goingUp) {
      this.setState({ direction: DIRECTIONS.DOWN });
      moveSnakeDirection = DIRECTIONS.DOWN;
    } else if (keyPressed === UP_KEY && !goingDown) {
      this.setState({ direction: DIRECTIONS.UP });
      moveSnakeDirection = DIRECTIONS.UP;
    }

    if (!moveSnakeDirection) {
      moveSnakeDirection = direction;
    }

    this.moveSnake(moveSnakeDirection);
  };

  generateFood = () => {
    // width="640"
    // height="420"
    const { snake } = this.state;
    const foodX = Math.floor((Math.random() * Math.floor(640)) / 10) * 10;

    const foodY = Math.floor((Math.random() * Math.floor(420)) / 10) * 10;

    const foodOnSnake =
      (foodX === snake[0].x || foodX === snake[snake.length - 1].x) &&
      (foodY === snake[0].y || foodY === snake[snake.length - 1].y);

    if (foodOnSnake) {
      this.generateFood();
    }

    return [foodX, foodY];
  };

  render() {
    return (
      <div>
        <canvas
          ref={(canvas) => {
            this.canvas = canvas;
          }}
          width="640"
          height="420"
          onKeyDown={this.handleKeyPress}
          tabIndex="0"
        />
      </div>
    );
  }
}

export default Snake;
