import React from 'react'
import { Text } from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'

import cn from 'classnames'
import { TableHeadersProps } from '@island.is/financial-aid/shared/lib'

interface PageProps {
  header: TableHeadersProps
  index: number
}

const TableHeaders = ({ index, header }: PageProps) => {
  return (
    <th
      className={cn({
        [`${tableStyles.tablePadding}`]: true,
        [`${tableStyles.firstChildPadding}`]: index === 0,
      })}
    >
      <Text color="dark300" fontWeight="semiBold">
        {header.title}
      </Text>
    </th>
  )
}

export default TableHeaders
