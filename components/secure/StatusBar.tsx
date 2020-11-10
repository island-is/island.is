import React, { Component } from 'react';
import APIResponse from "../../models/APIResponse";

class StatusBar extends Component<{status: APIResponse}> {
    render()
    {
        console.log("StatusBar " + this.props.status.statusCode);
        let className = 'statusbar';
        if (this.props.status.statusCode !== 200) {
          className += ' error';
        }

        return (
            <div className={className}>
            <div className="statusbar__code">
                {this.props.status.statusCode}
            </div>
            <div className="statusbar__message">
                {this.props.status.message}
            </div>
            <div className="statusbar__error">
                {this.props.status.error}
            </div>
        </div>
        );
    }
}

export default StatusBar;
