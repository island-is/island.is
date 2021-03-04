import React, { ReactNode, Fragment, FC, useMemo } from 'react'
import cn from 'classnames'
import uniq from 'lodash/uniq'
import { Icon, IconTypes } from '../Icon/Icon'
import { Box } from '../Box/Box'
import * as styles from './Pagination.treat'

const range = (min: number, max: number): number[] =>
  new Array(max - min + 1).fill(0).map((_, i) => min + i)

export interface PaginationProps {
  page: number
  totalPages: number
  previousPageText: string
  nextPageText: string
  pageText: string
  renderLink: (
    page: number,
    className: string,
    ariaLabel: string,
    children: ReactNode,
  ) => ReactNode
}

export const Pagination: FC<PaginationProps> = ({
  page,
  totalPages,
  previousPageText,
  nextPageText,
  pageText,
  renderLink,
}) => {
  const ranges = useMemo(() => {
    return uniq(
      ([] as number[])
        .concat(
          range(1, 3),
          range(page - 1, page + 1),
          range(totalPages - 2, totalPages),
        )
        .filter((p) => 1 <= p && p <= totalPages)
        .sort((a, b) => a - b),
    )
  }, [page, totalPages])

  const renderEdgeLink = ({
    page,
    isActive,
    ariaLabel,
    iconType,
  }: {
    page: number
    isActive: boolean
    ariaLabel: string
    iconType: IconTypes
  }) => {
    if (isActive) {
      return renderLink(
        page,
        cn(styles.link, styles.edge),
        ariaLabel,
        <Icon type={iconType} width={16} height={16} color="purple400" />,
      )
    }

    return (
      <span className={cn(styles.link, styles.linkDisabled)}>
        <Icon type={iconType} width={16} height={16} color="purple300" />
      </span>
    )
  }

  return (
    <Box display="flex" justifyContent="spaceBetween">
      <div>
        {renderEdgeLink({
          page: page - 1,
          isActive: page > 1,
          ariaLabel: previousPageText,
          iconType: 'arrowLeft',
        })}
      </div>
      <div>
        {ranges.map((thisPage, i) => (
          <Fragment key={thisPage}>
            {i > 0 && ranges[i - 1] !== thisPage - 1 && (
              <span className={styles.gap}>&hellip;</span>
            )}
            {renderLink(
              thisPage,
              cn(styles.link, { [styles.linkCurrent]: thisPage === page }),
              `${pageText} ${i + 1}`,
              <>{thisPage}</>,
            )}
          </Fragment>
        ))}
      </div>
      <div>
        {renderEdgeLink({
          page: page + 1,
          isActive: page < totalPages,
          ariaLabel: nextPageText,
          iconType: 'arrowRight',
        })}
      </div>
    </Box>
  )
}
