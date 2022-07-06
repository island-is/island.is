import { Box, Icon } from '@island.is/island-ui/core'
import React from 'react'
import { Document } from '@island.is/api/schema'
import * as styles from './Pagination.css'
import cn from 'classnames'

interface Props {
  page: number
  pageSize: number
  handlePageChange: (page: number) => void
  data: Document[]
}
export const Pagination = ({
  page,
  pageSize,
  handlePageChange,
  data,
}: Props) => {
  const renderEdgeLink = ({
    page,
    isActive,
    iconType,
  }: {
    page: number
    isActive: boolean
    iconType: 'arrowForward' | 'arrowBack'
  }) => {
    if (isActive) {
      return (
        <button
          onClick={handlePageChange.bind(null, page)}
          className={cn(styles.link, styles.edge)}
        >
          <Icon
            className={styles.icon}
            icon={iconType}
            type="filled"
            color="purple400"
          />
        </button>
      )
    }

    return (
      <button disabled className={cn(styles.link, styles.linkDisabled)}>
        <Icon
          className={styles.icon}
          icon={iconType}
          type="filled"
          color="purple200"
        />
      </button>
    )
  }

  return (
    <Box marginTop={4}>
      <Box
        display="flex"
        justifyContent="spaceBetween"
        className={styles.variants['purple']}
      >
        <div>
          {renderEdgeLink({
            page: page - 1,
            isActive: page > 1,
            iconType: 'arrowBack',
          })}
        </div>

        <div>
          {renderEdgeLink({
            page: page + 1,
            isActive: data.length > pageSize,
            iconType: 'arrowForward',
          })}
        </div>
      </Box>
    </Box>
  )
}
