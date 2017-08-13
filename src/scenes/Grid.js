import React, { Component } from 'react';
import './Grid.css';

class Grid extends Component {
  constructor() {
    super();
    this.state = {
      visualGrd: [],
      living: true,
    }
    this.grid = [];
    this.resurrection = this.resurrection.bind(this);
  }

  render() {
    return (
      <div className="Grid">

        {this.state.visualGrid}

      </div>
    );
  }

  componentWillMount() {
    var visualGrid = [];
    for (let i = 0; i < 50; i++) {
      this.grid.push([]);
      for (let j = 0; j <= 70; j++) {
        this.grid[i].push(0);
      }
    }
    for (let i = 0; i < 50; i++) {
      visualGrid.push([]);
      visualGrid[i].push(<div className="Row"/>);
      for (let j = 1; j <= 70; j++) {
        visualGrid[i].push(<div key={i + '' + j} className={this.grid[i][j] === 0 ? 'Dead' : 'Alive'} onClick={() => this.resurrection(i,j)}/>);
      }
    }
    this.setState({visualGrid});
  }

  resurrection(i, j) {
    this.grid[i][j] = this.grid[i][j] === 0 ? 1 : 0;
    var visualGrid = this.state.visualGrid;
    visualGrid[i][j] = <div key={i + '' + j} className={this.grid[i][j] === 0 ? 'Dead' : 'Alive'} onClick={() => this.resurrection(i,j)}/>
    this.setState({visualGrid});
  }

}

export default Grid;
