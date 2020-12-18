import React, { useState, useEffect } from "react";

interface Props {
  lastPage: number;
  handlePageChange: (page: number, count: number) => void,
}

const Paginator: React.FC<Props> = (props: Props) =>{
  const [page, setPage] = useState<number>(1); 
  const [count, setCount] = useState<number>(30); // TODO: Set to something that makes sense 30 

  // Runs only once and trickers initial page change of parent
  useEffect(() => {
    props.handlePageChange(page, count);
  }, []);

  const changeCount = (count: string) => {
    setPage(1);
    setCount(+count);
    props.handlePageChange(1, +count);
  }

  const next = async () => {
    if (page === props.lastPage) {
      return;
    }

    setPage(page+1);
    props.handlePageChange(page+1, count);
  };

  const previous = async () => {
    if (page === 1) {
      return;
    }
    setPage(page-1);
    props.handlePageChange(page-1, count);
  };

  return( 

      <div className="paginator">
        <nav className="paginator__pagination">
        <li className="paginator__page-item">
          <button
            onClick={previous}
            className="paginator__pagination-previous"
            disabled={page === 1}
          >
            Back
          </button>
        </li>
        <li className="paginator__page-item">
          <button
            onClick={next}
            className="paginator__pagination-next"
            disabled={page === props.lastPage}
          >
            Next
          </button>
        </li>
      </nav>
      <div className="paginator__container__form">
      <div className="paginator__container__field">
            <label htmlFor="count" className="paginator__label">
              Count
            </label>
            <select
              id="count"
              onChange={(e) => changeCount(e.target.value)}
              className="paginator__select"
              defaultValue={count}
            >
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
      </div>
         
      </div>
      
    );
}

export default Paginator;
