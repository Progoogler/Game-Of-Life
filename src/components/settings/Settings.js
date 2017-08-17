import React, { Component } from 'react';
import './Settings.css';

class Settings extends Component {
  render() {
    return (
      <div className="Settings-Container">
        <button className="Settings-Button" type="button" onClick={() => this.props.rateSetting('fast')}>Fast</button>
        <button className="Settings-Button" type="button" onClick={() => this.props.rateSetting('medium')}>Medium</button>
        <button className="Settings-Button" type="button" onClick={() => this.props.rateSetting('slow')}>Slow</button>
        <div className="space"/>
        <button className="Settings-Button" type="button" onClick={() => this.props.sizeSetting({length: 25, width: 50})}>25 x 50</button>
        <button className="Settings-Button" type="button" onClick={() => this.props.sizeSetting({length: 50, width: 70})}>50 x 70</button>
        <button className="Settings-Button" type="button" onClick={() => this.props.sizeSetting({length: 50, width: 100})}>50 x 100</button>
      </div>
    );
  }
}

export default Settings;
