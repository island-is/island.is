import React, { Component } from "react";

class Paginator extends Component<{lastPage: number; handlePageChange: any }> {
  page = 1;
  count = 1;

  changeCount(count: string) {
    this.setState({
      count: +count,
      page: 1,
    });
    console.log("this.page " + this.page);
    this.props.handlePageChange(1, +count);
  }

  next = async () => {
    if (this.page === this.props.lastPage) {
      return;
    }

    this.page++;
    this.props.handlePageChange(this.page, this.count);
  };

  previous = async () => {
    if (this.page === 1) {
      return;
    }

    this.page--;
    this.props.handlePageChange(this.page, this.count);
  };

  render() {
    console.log(this.page);
    console.log("Paginator: " + this.props.lastPage);

    return (
      <div className="paginator">
        <nav className="paginator__pagination">
        <li className="paginator__page-item">
          <button
            onClick={this.previous}
            className="paginator__pagination-previous"
            disabled={this.page === 1}
          >
            Back
          </button>
        </li>
        <li className="paginator__page-item">
          <button
            onClick={this.next}
            className="paginator__pagination-next"
            disabled={this.page === this.props.lastPage}
          >
            Next
          </button>
        </li>
      </nav>
      <div className="paginator__container__form">
      <div className="paginator__container__field">
            <label htmlFor="count" className="paginator__label">
              Fjöldi á síðu
            </label>
            <select
              id="count"
              onChange={(e) => this.changeCount(e.target.value)}
              className="paginator__select"
            >
              <option value="1">1</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
      </div>
         
      </div>
      
    );
  }
}

export default Paginator;
