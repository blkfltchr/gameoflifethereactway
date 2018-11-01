import React from 'react';
import './App.css';
import Cell from './Cell'

class Grid extends React.Component {
  state = {
    cells: [],
    grid: [],
    generation: 0,
    interval: 200,
    speed: '1x',
    isRunning: false,
    rows: 18,
    columns: 33
  }

  refreshGrid() {
    let grid = this.state.grid.slice();
    for (let y = 0; y < this.state.rows; y++) {
      grid[y] = [];
      for (let x = 0; x < this.state.columns; x++) {
        grid[y][x] = false;
      }
    }
    this.setState({grid});
  }

  componentDidMount(){
    this.refreshGrid();
  }
  
  getElementOffset() {
    const rect = this.element.getBoundingClientRect();
    return {
      x: (rect.left + window.pageXOffset) - document.documentElement.clientLeft,
      y: (rect.top + window.pageYOffset) - document.documentElement.clientTop,
    };
  }

  fillCells() {
    let cells = [];
    for (let y = 0; y < this.state.rows; y++) {
      for (let x = 0; x < this.state.columns; x++) {
        if (this.state.grid[y][x]) {
          cells.push({ x, y });
        }
      }
    }
    this.setState({cells});
  }

  handleClick = (e) => {
    if (!this.state.isRunning) {
    const elementOffset = this.getElementOffset();
    const x = Math.floor((e.pageX - elementOffset.x) / 20);
    const y = Math.floor((e.pageY - elementOffset.y) / 20);
    this.state.grid[y][x] = !this.state.grid[y][x];
    this.fillCells();
    }
  }

  nextIteration = () => {

    let firstBuffer = this.state.grid.slice(0); // grid
    let secondBuffer = new Array(this.state.rows);
                        for (let i = 0; i < secondBuffer.length; i++) {
                          secondBuffer[i] = (new Array(this.state.columns)).fill(false)
                        }; // grid copy

    for (let x = 0; x < this.state.columns; x++) { // loop thru rows
		  for (let y = 0; y < this.state.rows; y++) { // loop thru columns
		    let neighbours = 0; // initialize neighbours

        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            if (x + dx >= 0 && x + dx < this.state.columns) {
              if (y + dy >= 0 && y + dy < this.state.rows) {
                if (firstBuffer[y][x]) {
                }
                if (firstBuffer[y + dy][x + dx] && (dx!== dy || dy !== 0)) {
                  neighbours++;
                }
              }
            }
          }
        }

		    if (firstBuffer[y][x]) {
          if (neighbours >= 2 && neighbours <= 3) {
            secondBuffer[y][x] = true;
          }
        } // if less than 2 neighbours or more than three neighbours, it dies
		    if (!firstBuffer[y][x]) {
          if (neighbours === 3) {
            secondBuffer[y][x] = true; // if exactly 3 neighbours, it's born
          }
        } 
		  }
		}
    this.setState({ 
      grid: secondBuffer, // fill cells with second buffer
      generation: this.state.generation + 1 }, this.fillCells ) // increase generations
    }

  playGame = () => {
    this.setState({ isRunning: true })
    clearInterval(this.intervalID);
		this.intervalID = setInterval(this.nextIteration, this.state.interval);
  }

  pauseGame = () => {
    this.setState({ isRunning: false })
    clearInterval(this.intervalID);
  }

  randomGame = () => {
    if (!this.state.isRunning) {
      for (let y = 0; y < this.state.rows; y++) {
          for (let x = 0; x < this.state.columns; x++) {
              this.state.grid[y][x] = (Math.random() < 0.33);
          }
      }
      this.fillCells();
    }
  }

  clearGame = () => { 
    this.refreshGrid();
    window.location.reload();
  }

  fast = () => {
      this.setState({ interval: 100, speed: '2x'});
  }

  slow = () => {
      this.setState({ interval: 400, speed: '0.5x'});
  }

  render() {
    return (
      <div>
        <p>Generations: {this.state.generation} Speed: {this.state.speed}</p>
        <div className="Grid"
        onClick={this.handleClick}
        ref={(node) => { this.element = node; }}>
        {this.state.cells.map(cell => (
            <Cell x={cell.x} 
                  y={cell.y}
                  key={`${cell.x}_${cell.y}`}/>
          ))}
        </div>
        <button onClick={this.playGame}>Play</button>
        <button onClick={this.pauseGame}>Pause</button>
        <button onClick={this.nextIteration}>Next</button>
        <button onClick={this.fast}>Fast</button>
        <button onClick={this.slow}>Slow</button>
        <button onClick={this.randomGame}>Random</button>
        <button onClick={this.clearGame}>Clear</button>
      </div>
    );
  }
}
export default Grid;