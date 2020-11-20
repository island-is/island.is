import React, { Component, useState } from "react";
import APIResponse from "../../models/APIResponse";

class StatusBar extends Component<{ status: APIResponse | null }> {
  
  render() {
    if (!this.props.status){
      return("");
    }

    return (
      <div className={`statusbar ${this.props.status.statusCode > 400 ? 'error':''}`}>
        <div className="statusbar__code">{this.props.status.statusCode}</div>
        <div className="statusbar__message">{this.props.status.message}</div>
        <div className="statusbar__error">{this.props.status.error}</div>
      </div>
    );
  }
}

export default StatusBar;
