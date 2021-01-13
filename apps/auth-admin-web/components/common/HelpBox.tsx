/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from 'react';

class HelpBox extends Component<{
  helpText: string;
  helpLink?: string;
  helpLinkText?: string;
}> {
  state = {
    show: false,
  };

  getHelpLink(): JSX.Element {
    if (this.props.helpLink && this.props.helpLinkText) {
      return (
        <div className="helpLink">
          <a href={this.props.helpLink} target="_blank" rel="noreferrer">
            {this.props.helpLinkText}
          </a>
        </div>
      );
    } else if (this.props.helpLink) {
      return (
        <div className="helpLink">
          <a href={this.props.helpLink} target="_blank" rel="noreferrer">
            More Info
          </a>
          .
        </div>
      );
    }
    return <div></div>;
  }

  render(): JSX.Element {
    return (
      <div className="helpbox">
        <a
          className="helpbox__button__show"
          onClick={() => this.setState({ show: !this.state.show })}
          title={this.props.helpText}
        >
          <i className="icon__info"></i>
          <span>Info</span>
        </a>
        <div
          className={`helpbox__content ${
            this.state.show === true ? 'show' : 'hidden'
          }`}
        >
          <a
            className="helpbox__content__button__close"
            onClick={() => this.setState({ show: !this.state.show })}
          >
            &times;
          </a>
          {this.props.helpText}
          {this.getHelpLink()}
        </div>
      </div>
    );
  }
}
export default HelpBox;
