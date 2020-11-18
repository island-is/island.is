import React, { Component } from "react";


class Header extends Component {
  logout = () => {
    // TODO: Logout
  };

  render() {
    return (
      <header className="header__container">
        <div className="header__container__logo">
          <h1>IDS management</h1>
        </div>
        <div className="header__container__options">
          <div className="header__container__user">
            <div className="header__username">Unnar Snær Bjarnason</div>
            <div className="header__container__logout">
              <button
                className="header__button__logout"
                onClick={() => this.logout()}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

export default Header;
