import React from 'react'
import { Text, Icon, Box } from '@island.is/island-ui/core'

import * as styles from './TableHeaders.treat'

import cn from 'classnames'
import { TableHeadersProps } from '@island.is/financial-aid-web/veita/src/routes/ApplicationsOverview/applicationsOverview'

interface PageProps {
  header: TableHeadersProps
  index: number
}

const TableHeaders: React.FC<PageProps> = ({ index, header }) => {
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
