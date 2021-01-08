import React, { Component } from 'react';

class HelpBox extends Component<{
  helpText: string;
  helpLink?: string;
  helpLinkText?: string;
}> {
  state = {
    show: false,
  };

  getHelpLink() {
    if (this.props.helpLink && this.props.helpLinkText) {
      return (
        <div className="helpLink">
          <a href={this.props.helpLink} target="_blank">{this.props.helpLinkText}</a>
        </div>
      );
    } else if (this.props.helpLink) {
      return (
        <div className="helpLink">
          <a href={this.props.helpLink} target="_blank">More Info</a>.
        </div>
      );
    }
    return '';
  }

  render() {
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
