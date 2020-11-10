import React, { Component } from 'react';

class Paginator extends Component<{lastPage: number, handlePageChange: any}> {
    page: number = 1;
    

    componentDidMount(){
      this.render();
    }

    next = async () => {
        if (this.page === this.props.lastPage) {
          return;
        }
    
        this.page++;
        this.props.handlePageChange(this.page);
      };
    
      previous = async () => {
        if (this.page === 1) {
          return;
        }
    
        this.page--;
        this.props.handlePageChange(this.page);
      };
    
        render() {
          console.log(this.page);
          console.log("Paginator: " + this.props.lastPage);

        return (
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
        );
    }
}

export default Paginator;