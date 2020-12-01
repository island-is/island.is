import React, { Component } from 'react';
import APIResponse from '../../models/APIResponse';

class StatusBar extends Component<{ status: APIResponse | null }> {
  getMessage = () => {
    if (typeof this.props.status.message === 'string') {
      return <span>{this.props.status.message}</span>;
    } else {
      return this.props.status.message.map((item, i) => <span>{item}</span>);
    }
  };

  render() {
    console.log("statusbar");
    console.log(this.props.status);
    if (!this.props.status) {
      return '';
    }

    return (
      <div
        className={`statusbar ${
          this.props.status.statusCode > 399 ? 'error' : ''
        }`}
      >
        <div className="statusbar__message">{this.getMessage()}</div>
        <div className="statusbar__code">{this.props.status.statusCode}</div>
        <div className="statusbar__error">{this.props.status.error}</div>
      </div>
    );
  }
}

export default StatusBar;
