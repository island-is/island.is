import React from 'react'
import { Box, Icon, Text } from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'

import cn from 'classnames'
import { SortableTableHeaderProps } from '@island.is/financial-aid/shared/lib'

interface PageProps {
  header: SortableTableHeaderProps
  index: number
  onClick: () => void
  sortAsc: boolean
  isSortActive: boolean
}

const SortableTableHeader = ({
  index,
  header,
  onClick,
  sortAsc,
  isSortActive,
}: PageProps) => {
  return (
    <th
      className={cn({
        [`${tableStyles.tablePadding}`]: true,
        [`${tableStyles.firstChildPadding}`]: index === 0,
      })}
    >
      <Box
        component="button"
        display="flex"
        alignItems="center"
        width="full"
        onClick={onClick}
      >
        <Text color="dark300" fontWeight="semiBold">
          {header.title}
        </Text>

        <Box
          className={cn(tableStyles.sortIcon, {
            [tableStyles.sortActive]: isSortActive,
            [tableStyles.sortAsc]: sortAsc,
            [tableStyles.sortDes]: !sortAsc,
          })}
          marginLeft={1}
          component="span"
          display="flex"
          alignItems="center"
          justifyContent="flexEnd"
        >
          <Icon icon="caretDown" size="small" color="dark300" />
        </Box>
      </Box>
    </th>
  )
}

export default SortableTableHeader
