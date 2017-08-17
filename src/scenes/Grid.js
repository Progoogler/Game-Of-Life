import React, { Component } from 'react';
import './Grid.css';

import Title from '../components/title/Title';
import Controls from '../components/controls/Controls';
import Settings from '../components/settings/Settings';

class Grid extends Component {
  constructor() {
    super();
    this.state = {
      visualGrd: [],
      generations: 0,
      living: true,
      rate: 100,
    }
    this._pulse = undefined;
    this.grid = [];
    this.aux = {};
    this.aliveCells = {};
    this.fast = 100;
    this.medium = 400;
    this.slow = 800;
    this.size = {length: 50, width: 70};
    this.resurrection = this.resurrection.bind(this);
    this.simulateLife = this.simulateLife.bind(this);
    this.annihilate = this.annihilate.bind(this);
    this.play = this.play.bind(this);
    this.stopTime = this.stopTime.bind(this);
    this.armageddon = this.armageddon.bind(this);
    this.setRate = this.setRate.bind(this);
  }

  render() {
    return (
      <div className="Background">
        <Title/>
        <div className="Control-Row">
          <Controls play={this.play} pause={this.stopTime} clear={this.armageddon}/>
          <div className="Generations">Generations: {this.state.generations}</div>
        </div>

        <div className="Grid-Settings-Container">
          <Settings rateSetting={this.setRate} sizeSetting={this.armageddon}/>
          <div className="Grid">

            { this.state.visualGrid }

          </div>
        </div>
      </div>
    );
  }

  componentWillMount() {
    var visualGrid = [];
    for (let i = 0; i < this.size.length; i++) {
      this.grid.push([]);
      for (let j = 0; j <= this.size.width; j++) {
        if (i === 20 && j === 35) {
          this.grid[i].push(1);
          this.aliveCells[i + ',' + j] = 1;
        } else if (i === 21 && (j === 35 || j === 36 || j === 37 || j === 38)) {
          this.grid[i].push(1);
          this.aliveCells[i + ',' + j] = 1;
        } else if (i === 25 && j === 35) {
          this.grid[i].push(1);
          this.aliveCells[i + ',' + j] = 1;
        } else if (i === 26 && (j === 35 || j === 36 || j === 37 || j === 38)) {
          this.grid[i].push(1);
          this.aliveCells[i + ',' + j] = 1;
        } else if (i === 25 && j === 28) {
          this.grid[i].push(1);
          this.aliveCells[i + ',' + j] = 1;
        } else if (i === 26 && (j === 28 || j === 27 || j === 26 || j === 25)) {
          this.grid[i].push(1);
          this.aliveCells[i + ',' + j] = 1;
        } else if (i === 25 && j === 44) {
          this.grid[i].push(1);
          this.aliveCells[i + ',' + j] = 1;
        } else if (i === 26 && (j === 44 || j === 45 || j === 46 || j === 47)) {
          this.grid[i].push(1);
          this.aliveCells[i + ',' + j] = 1;
        } else if (i === 30 && j === 35) {
          this.grid[i].push(1);
          this.aliveCells[i + ',' + j] = 1;
        } else if (i === 31 && (j === 35 || j === 36 || j === 37 || j === 38)) {
          this.grid[i].push(1);
          this.aliveCells[i + ',' + j] = 1;
        } else {
          this.grid[i].push(0);
        }
      }
    }
    for (let i = 0; i < this.size.length; i++) {
      visualGrid.push([]);
      visualGrid[i].push(<div className="Row"/>);
      for (let j = 1; j <= this.size.width; j++) {
        visualGrid[i].push(<div key={i + '' + j} className={this.grid[i][j] === 0 ? 'Dead' : this.aliveCells[i + ',' + j] === 1 ? 'Alive' : 'Old'} onClick={() => this.resurrection(i,j,'now')}/>);
      }
    }
    this.setState({visualGrid});
    setTimeout(this.simulateLife, 500);
  }

  resurrection(i, j, now) {
    if (now) {
      this.grid[i][j] = this.grid[i][j] === 0 ? 1 : 0;
      if (this.grid[i][j]) {
        this.aliveCells[i + ',' + j] = 1;
      } else {
        delete this.aliveCells[i + ',' + j];
      }
      let visualGrid = this.state.visualGrid;
      visualGrid[i][j] = <div key={i + '' + j} className={this.grid[i][j] === 0 ? 'Dead' : this.aliveCells[i + ',' + j] === 1 ? 'Alive' : 'Old'} onClick={() => this.resurrection(i,j,'now')}/>
      this.setState({visualGrid});
    } else if (this.grid[i][j] === 0) {
      this.aux[i + ',' + j] = 1;
    } else {
      this.aux[i + ',' + j] = 0;
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
    if (this.aux[i + ',' + j] === undefined) {
      living ? this.survival(i, j, neighbors) : this.reincarnate(i, j, neighbors);
    }
  }

  checkNonLivingNeighbors(i, j, count) {
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

  restart() {
    this._pulse = setTimeout(this.simulateLife, this.state.rate);
  }

  play() {
    if (this.state.living) {
      this.simulateLife();
    } else {
      this.setState({living: true});
      this.simulateLife();
    }
  }

  simulateLife() {
    this.reborn()
    .then(this.annihilate)
    .then(() => {
      if (this.state.living) {
        this.restart();
      }
    });
  }

  reborn() {
    // Potentially unnecessary to resolve w/ Promise now that this.aux only configures this.grid after both rounds.
    return new Promise((resolve, reject) => {
      var length = Object.keys(this.aliveCells).length;
      var i = 0;
      for (let cell in this.aliveCells) {
        if (this.aliveCells[cell] === 1) this.aliveCells[cell]++; // Cell ages
        // Check non-living cell neighbors
        let ref = cell.split(',');
        i = this.checkNonLivingNeighbors(parseInt(ref[0], 10), parseInt(ref[1], 10), i);
      }
      if (i === length) {
        resolve();
      } else {
        reject();
      }
    });
  }

  annihilate() {
    return new Promise((resolve, reject) => {
      var visualGrid = this.state.visualGrid;
      for (let cell in this.aliveCells) {
        let ref = cell.split(',');
        this.checkNeighbors(parseInt(ref[0], 10), parseInt(ref[1], 10), 'living');
        visualGrid[ref[0]][ref[1]] = <div key={cell} className={this.grid[ref[0]][ref[1]] === 0 ? 'Dead' : this.aliveCells[ref[0] + ',' + ref[1]] === 1 ? 'Alive' : 'Old'} onClick={() => this.resurrection(ref[0],ref[1],'now')}/>
      }
      if (Object.keys(this.aux).length) {
        for (let cell in this.aux) {
          let ref = cell.split(',');
          if (this.aux[cell] === 1) {
            this.aliveCells[cell] = 1;
            this.grid[ref[0]][ref[1]] = 1;
          } else {
            delete this.aliveCells[cell];
            this.grid[ref[0]][ref[1]] = 0;
          }
          visualGrid[ref[0]][ref[1]] = <div key={cell} className={this.grid[ref[0]][ref[1]] === 0 ? 'Dead' : this.aliveCells[ref[0] + ',' + ref[1]] === 1 ? 'Alive' : 'Old'} onClick={() => this.resurrection(ref[0],ref[1],'now')}/>
        }
        this.aux = {};
      }
      if (Object.keys(this.aux).length === 0) {
        this.setState({visualGrid, generations: this.state.generations + 1});
        resolve();
      } else {
        reject();
      }
    });
  }

  stopTime() {
    this.setState({living: false});
    clearTimeout(this._pulse);
  }

  armageddon(size) {
    if (size) this.size = size;
    clearTimeout(this._pulse);
    var visualGrid = [];
    this.grid = [];
    this.aux = {};
    this.aliveCells = {};
    for (let i = 0; i < this.size.length; i++) {
      this.grid.push([]);
      for (let j = 0; j <= this.size.width; j++) {
        this.grid[i].push(0);
      }
    }
    for (let i = 0; i < this.size.length; i++) {
      visualGrid.push([]);
      visualGrid[i].push(<div className="Row"/>);
      for (let j = 1; j <= this.size.width; j++) {
        visualGrid[i].push(<div key={i + '' + j} className={this.grid[i][j] === 0 ? 'Dead' : this.aliveCells[i + ',' + j] === 1 ? 'Alive' : 'Old'} onClick={() => this.resurrection(i,j,'now')}/>);
      }
    }
    this.setState({visualGrid, living: false, generations: 0});
  }

  setRate(rate) {
    switch (rate) {
      case 'fast':
        this.setState({rate: this.fast});
        break;
      case 'medium':
        this.setState({rate: this.medium});
        break;
      case 'slow':
        this.setState({rate: this.slow});
        break;
      default:
        return;
    }
  }

}

export default Grid;
