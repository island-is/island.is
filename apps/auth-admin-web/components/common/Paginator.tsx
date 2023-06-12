import React, { useState, useEffect } from 'react'
import LocalizationUtils from '../../utils/localization.utils'
import { Localization } from '../../entities/common/Localization'

interface Props {
  lastPage: number
  handlePageChange: (page: number, count: number) => void
}

const Paginator: React.FC<React.PropsWithChildren<Props>> = (props: Props) => {
  const [page, setPage] = useState<number>(1)
  const [count, setCount] = useState<number>(100)
  const [localization] = useState<Localization>(
    LocalizationUtils.getLocalization(),
  )

  // Runs only once and trickers initial page change of parent
  useEffect(() => {
    props.handlePageChange(page, count)
  }, [])

  const changeCount = (count: string) => {
    setPage(1)
    setCount(+count)
    props.handlePageChange(1, +count)
  }

  const next = async () => {
    if (page === props.lastPage) {
      return
    }

    setPage(page + 1)
    props.handlePageChange(page + 1, count)
  }

  const previous = async () => {
    if (page === 1) {
      return
    }
    setPage(page - 1)
    props.handlePageChange(page - 1, count)
  }

  return (
    <div className="paginator">
      <nav className="paginator__pagination">
        <li className="paginator__page-item">
          <button
            type="button"
            onClick={previous}
            className="paginator__pagination-previous"
            disabled={page === 1}
          >
            {localization.paginator.backButton}
          </button>
        </li>
        <li className="paginator__page-item">
          <button
            type="button"
            onClick={next}
            className="paginator__pagination-next"
            disabled={page === props.lastPage || props.lastPage === 0}
          >
            {localization.paginator.nextButton}
          </button>
        </li>
      </nav>
      <div className="paginator__container__form">
        <div className="paginator__container__field">
          <label htmlFor="count" className="paginator__label">
            {localization.paginator.count}
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
  )
}

export default Paginator
