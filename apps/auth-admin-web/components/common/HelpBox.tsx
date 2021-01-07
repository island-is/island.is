import React, { Component } from 'react';

class HelpBox extends Component<{ helpText: string }> {
  state = {
    show: false,
  };
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
        </div>
      </div>
    );
  }
}
export default HelpBox;
