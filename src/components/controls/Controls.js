import React, { Component } from 'react';
import './Controls.css';

class Controls extends Component {
  render() {
    return (
      <div className="Controls-Container">
        <button className="Controls-Button" type="button" onClick={() => this.props.play()}>Play</button>
        <button className="Controls-Button" type="button" onClick={() => this.props.pause()}>Pause</button>
        <button className="Controls-Button" type="button" onClick={() => this.props.clear()}>Clear</button>
      </div>
    );
  }
}

export default Controls;
