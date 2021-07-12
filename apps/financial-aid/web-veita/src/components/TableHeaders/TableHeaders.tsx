import React from 'react'
import { Text, Icon, Box } from '@island.is/island-ui/core'

import * as styles from './TableHeaders.treat'

import cn from 'classnames'
import {
  sortByProps,
  TableHeadersProps,
} from '@island.is/financial-aid-web/veita/src/routes/ApplicationsOverview/applicationsOverview'

interface PageProps {
  header: TableHeadersProps
  index: number
  setSortBy(filter: string): void
  sortBy: sortByProps
}

const TableHeaders: React.FC<PageProps> = ({
  index,
  header,
  setSortBy,
  sortBy,
}) => {
  if (header.filterBy) {
    return (
      <th key={'headers-' + index}>
        <button
          onClick={() => {
            if (header.filterBy != undefined) {
              setSortBy(header.filterBy)
            }
          }}
          className={cn({
            [`${styles.tablePadding}`]: true,
            [`${styles.firstChildPadding}`]: index === 0,
          })}
        >
          <Box display="flex" alignItems="center">
            <Text color="dark300" fontWeight="semiBold">
              {header.title}
            </Text>

            <Box
              display="block"
              opacity={0}
              marginLeft="smallGutter"
              className={cn({
                [`${styles.showIcon}`]: sortBy.selected === header.filterBy,
              })}
            >
              <Icon
                color="dark300"
                icon="chevronDown"
                size="small"
                type="filled"
              />
            </Box>
          </Box>
        </button>
      </th>
    )
  }
  return (
    <th
      key={'headers-' + index}
      className={cn({
        [`${styles.tablePadding}`]: true,
        [`${styles.firstChildPadding}`]: index === 0,
      })}
    >
      <Text color="dark300" fontWeight="semiBold">
        {header.title}
      </Text>
    </th>
  )
}

export default TableHeaders
