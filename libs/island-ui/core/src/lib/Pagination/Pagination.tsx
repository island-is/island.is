import React from 'react'
import cn from 'classnames'
import { uniq } from 'lodash'
import { Icon } from '../Icon/Icon'
import * as styles from './Pagination.treat'

const range = (min, max) =>
  new Array(max - min + 1).fill(0).map((_, i) => min + i)

export interface PaginationProps {
  page: number
  totalPages: number
  makeHref: (number) => string
  linkComp?: React.ReactType
}

export const Pagination = ({
  page,
  totalPages,
  makeHref,
  linkComp: Link = 'a',
}) => {
  const renderEdgeLink = ({ page, isActive, iconType }) => {
    return isActive ? (
      <Link className={cn(styles.link, styles.edge)} href={makeHref(page)}>
        <Icon type={iconType} width={16} height={16} color="purple400" />
      </Link>
    ) : (
      <span className={cn(styles.link, styles.linkDisabled)}>
        <Icon type={iconType} width={16} height={16} color="purple300" />
      </span>
    )
  }

  const ranges = uniq(
    []
      .concat(
        range(1, 3),
        range(page - 1, page + 1),
        range(totalPages - 2, totalPages),
      )
      .filter((i) => 1 <= i && i <= totalPages),
  )

  return (
    <div className={styles.container}>
      <div>
        {renderEdgeLink({
          page: page - 1,
          isActive: page > 1,
          iconType: 'arrowLeft',
        })}
      </div>
      <div>
        {ranges.map((thisPage, i) => (
          <>
            {i > 0 && ranges[i - 1] !== thisPage - 1 && (
              <span className={styles.gap}>&hellip;</span>
            )}
            <Link
              className={cn(styles.link, {
                [styles.linkCurrent]: thisPage === page,
              })}
              href={makeHref(thisPage)}
            >
              {thisPage}
            </Link>
          </>
        ))}
      </div>
      <div>
        {renderEdgeLink({
          page: page + 1,
          isActive: page < totalPages,
          iconType: 'arrowRight',
        })}
      </div>
    </div>
  )
}

export default Pagination
