import React, { Component } from 'react';
import './Grid.css';

class Grid extends Component {
  constructor() {
    super();
    this.state = {
      visualGrd: [],
      generation: 0,
      living: true,
    }
    this.grid = [];
    this.aux = {};
    this.aliveCells = {};
    this.resurrection = this.resurrection.bind(this);
    this.simulateLife = this.simulateLife.bind(this);
  }

  render() {
    return (
      <div className="Grid">

        { this.state.visualGrid }

        <div className="Button" onClick={() => this.simulateLife()}>Start</div>

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
        visualGrid[i].push(<div key={i + '' + j} className={this.grid[i][j] === 0 ? 'Dead' : 'Alive'} onClick={() => this.resurrection(i,j,'now')}/>);
      }
    }
    this.setState({visualGrid});
    setTimeout(this.simulateLife.bind(this), 1000);
  }

  resurrection(i, j, now) {
    //this.grid[i][j] = this.grid[i][j] === 0 ? 1 : 0;
    if (now) { console.log('bring to life', i + '' + j)
      this.grid[i][j] = this.grid[i][j] === 0 ? 1 : 0;
      if (this.grid[i][j]) {
        this.aliveCells[i + ',' + j] = true;
      } else {
        delete this.aliveCells[i + ',' + j];
      }
      let visualGrid = this.state.visualGrid;
      visualGrid[i][j] = <div key={i + '' + j} className={this.grid[i][j] === 0 ? 'Dead' : 'Alive'} onClick={() => this.resurrection(i,j,'now')}/>
      this.setState({visualGrid, generation: this.state.generation + 1});
    } else if (this.grid[i][j] === 0) {
      this.aux[i + ',' + j] = 1;
    } else if (this.grid[i][j] === 1) { console.log('delete', i + '' + j)
      this.aux[i + ',' + j] = 0;
      //delete this.aliveCells[i + ',' + j];
    }
  }

  checkNeighbors(i, j, living) {
    var neighbors = 0;
    var top, bot, left, right;
    if (i === 0) {
      top = this.grid.length - 1;
      bot = i + 1;
    } else {
      top = i - 1;
      if (i === this.grid.length - 1) {
        bot = 0;
      } else {
        bot = i + 1;
      }
    }

    if (j === 1) {
      left = this.grid[i].length - 1;
      right = j + 1;
    } else {
      left = j - 1;
      if (j === this.grid[i].length - 1) {
        right = 1;
      } else {
        right = j + 1;
      }
    }

    if (this.grid[top][left] === 1) neighbors++;
    if (this.grid[top][j] === 1) neighbors++;
    if (this.grid[top][right] === 1) neighbors++;
    if (this.grid[i][left] === 1) neighbors++;
    if (this.grid[i][right] === 1) neighbors++;
    if (this.grid[bot][left] === 1) neighbors++;
    if (this.grid[bot][j] === 1) neighbors++;
    if (this.grid[bot][right] === 1) neighbors++;

    console.log(i + '' + j, neighbors, this.grid[bot][left], this.grid[bot][right])
    if (this.aux[i + ',' + j] === undefined) {
      living ? this.survival(i, j, neighbors) : this.reincarnate(i, j, neighbors);
    }
  }

  checkNonLivingNeighbors(i, j, count) { console.log('check non living neighbors of', i+''+j)
    var top, bot, left, right;
    if (i === 0) {
      top = this.grid.length - 1;
      bot = i + 1;
    } else {
      top = i - 1;
      if (i === this.grid.length - 1) {
        bot = 0;
      } else {
        bot = i + 1;
      }
    }

    if (j === 1) {
      left = this.grid[i].length - 1;
      right = j + 1;
    } else {
      left = j - 1;
      if (j === this.grid[i].length - 1) {
        right = 1;
      } else {
        right = j + 1;
      }
    }

    if (this.grid[top][left] === 0) this.checkNeighbors(top, left);
    if (this.grid[top][j] === 0) this.checkNeighbors(top, j);
    if (this.grid[top][right] === 0) this.checkNeighbors(top, right);
    if (this.grid[i][left] === 0) this.checkNeighbors(i, left);
    if (this.grid[i][right] === 0) this.checkNeighbors(i, right);
    if (this.grid[bot][left] === 0) this.checkNeighbors(bot, left);
    if (this.grid[bot][j] === 0) this.checkNeighbors(bot, j);
    if (this.grid[bot][right] === 0) this.checkNeighbors(bot, right);
    return count + 1;
  }

  survival(i, j, neighbors) {
    if (neighbors < 2 || neighbors > 3) {
      this.resurrection(i,j); // Kill this cell
    }
  }

  reincarnate(i, j, neighbors) {
    if (neighbors === 3) {
      this.resurrection(i,j); // Resurrect this cell
    }
  }

  simulateLife() { console.log('alive cells', this.aliveCells);
    this.reborn().then(this.annihilate());
  }

  reborn() {
    return new Promise((resolve, reject) => {
      var length = Object.keys(this.aliveCells).length;
      var i = 0;
      for (let cell in this.aliveCells) {
        // check non-living cell neighbors
        let ref = cell.split(',');
        i = this.checkNonLivingNeighbors(parseInt(ref[0], 10), parseInt(ref[1], 10), i);
      }
      if (i === length) {
        // if (Object.keys(this.aux).length) { console.log('after reborn', this.aux)
        //   var visualGrid = this.state.visualGrid;
        //   for (let cell in this.aux) {
        //     let ref = cell.split(',');
        //     if (this.aux[cell] === 1) {
        //       this.aliveCells[cell] = true;
        //       this.grid[ref[0]][ref[1]] = 1;
        //     } else {
        //       delete this.aliveCells[cell];
        //       this.grid[ref[0]][ref[1]] = 0;
        //     }
        //     visualGrid[ref[0]][ref[1]] = <div key={cell} className={this.grid[ref[0]][ref[1]] === 0 ? 'Dead' : 'Alive'} onClick={() => this.resurrection(ref[0],ref[1],'now')}/>
        //   }
        //   this.aux = {};
        //   this.setState({visualGrid, generation: this.state.generation + 1});
        // }
        resolve();
      } else {
        reject();
      }
    });
  }


  annihilate() {
    for (let cell in this.aliveCells) {
      let ref = cell.split(',');
      this.checkNeighbors(parseInt(ref[0], 10), parseInt(ref[1], 10), 'living');
    }
    if (Object.keys(this.aux).length) { console.log('after reborn', this.aux)
      var visualGrid = this.state.visualGrid;
      for (let cell in this.aux) {
        let ref = cell.split(',');
        if (this.aux[cell] === 1) {
          this.aliveCells[cell] = true;
          this.grid[ref[0]][ref[1]] = 1;
        } else {
          delete this.aliveCells[cell];
          this.grid[ref[0]][ref[1]] = 0;
        }
        visualGrid[ref[0]][ref[1]] = <div key={cell} className={this.grid[ref[0]][ref[1]] === 0 ? 'Dead' : 'Alive'} onClick={() => this.resurrection(ref[0],ref[1],'now')}/>
      }
      this.aux = {};
      this.setState({visualGrid, generation: this.state.generation + 1});
    }
  }

}

export default Grid;
