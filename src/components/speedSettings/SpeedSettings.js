import React, { Component } from 'react';
import './SpeedSettings.css';

class SpeedSettings extends Component {
  render() {
    return (
      <div className="Settings-Container">
        <button className="Settings-Button" type="button" onClick={() => this.props.rateSetting('fast')}>Fast</button>
        <button className="Settings-Button" type="button" onClick={() => this.props.rateSetting('medium')}>Medium</button>
        <button className="Settings-Button" type="button" onClick={() => this.props.rateSetting('slow')}>Slow</button>
      </div>
    );
  }
}

export default SpeedSettings;
