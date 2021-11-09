import React from 'react'
import { Box } from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'
import cn from 'classnames'

interface PageProps {
  items: React.ReactNode[]
  index: number
  identifier: string
  onClick?: () => void
}

const TableBody = ({ items, index, identifier, onClick }: PageProps) => {
  return (
    <tr
      className={cn([
        `${onClick === undefined ? '' : tableStyles.link} contentUp`,
      ])}
      style={{ animationDelay: 55 + 3.5 * index + 'ms' }}
      key={`tr-${identifier}`}
      onClick={onClick}
    >
      {items.map((item: React.ReactNode, i) => (
        <td
          className={cn({
            [`${tableStyles.tablePadding}
            ${i === 0 ? tableStyles.firstChildPadding : ''}`]: true,
          })}
          key={`td-${identifier}-${i}`}
        >
          <Box className={tableStyles.rowContent}>{item}</Box>
        </td>
      ))}
    </tr>
  )
}

export default TableBody
