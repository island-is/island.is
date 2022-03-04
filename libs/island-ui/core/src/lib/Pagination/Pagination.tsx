import React, { ReactNode, Fragment, FC, useMemo } from 'react'
import cn from 'classnames'
import uniq from 'lodash/uniq'
import { Colors } from '@island.is/island-ui/theme'
import { Icon, IconTypes } from '../Icon/Icon'
import { Box } from '../Box/Box'
import * as styles from './Pagination.css'

type ColorMap = Record<keyof typeof styles.variants, Colors>

const IconColorMap: ColorMap = {
  blue: 'blue400',
  purple: 'purple400',
}

const DisabledIconColorMap: ColorMap = {
  blue: 'blue300',
  purple: 'purple300',
}

const range = (min: number, max: number): number[] =>
  new Array(max - min + 1).fill(0).map((_, i) => min + i)

export interface PaginationProps {
  page: number
  totalPages: number
  variant?: keyof typeof styles.variants
  renderLink: (
    page: number,
    className: string,
    children: ReactNode,
  ) => ReactNode
}

export const Pagination: FC<PaginationProps> = ({
  page,
  totalPages,
  variant = 'purple',
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
    iconType,
  }: {
    page: number
    isActive: boolean
    iconType: IconTypes
  }) => {
    if (isActive) {
      return renderLink(
        page,
        cn(styles.link, styles.edge),
        <Icon
          type={iconType}
          width={16}
          height={16}
          color={IconColorMap[variant]}
        />,
      )
    }

    return (
      <span className={cn(styles.link, styles.linkDisabled)}>
        <Icon
          type={iconType}
          width={16}
          height={16}
          color={DisabledIconColorMap[variant]}
        />
      </span>
    )
  }

  return (
    <Box
      display="flex"
      justifyContent="spaceBetween"
      className={styles.variants[variant]}
    >
      <div>
        {renderEdgeLink({
          page: page - 1,
          isActive: page > 1,
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
              <>{thisPage}</>,
            )}
          </Fragment>
        ))}
      </div>
      <div>
        {renderEdgeLink({
          page: page + 1,
          isActive: page < totalPages,
          iconType: 'arrowRight',
        })}
      </div>
    </Box>
  )
}
