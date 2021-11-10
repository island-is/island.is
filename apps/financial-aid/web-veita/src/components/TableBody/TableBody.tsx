import React from 'react'
import { Box } from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'
import cn from 'classnames'

interface PageProps {
  items: React.ReactNode[]
  index: number
  identifier: string
  onClick?: () => void
  hasMaxWidth?: boolean
}

const TableBody = ({
  items,
  index,
  identifier,
  onClick,
  hasMaxWidth = true,
}: PageProps) => {
  return (
    <tr
      className={cn({
        ['contentUp']: true,
        [`${tableStyles.link}`]: onClick,
      })}
      style={{ animationDelay: 55 + 3.5 * index + 'ms' }}
      key={`tr-${identifier}`}
      onClick={onClick}
    >
      {items.map((item: React.ReactNode, i) => (
        <td
          className={cn({
            [`${tableStyles.tablePadding}`]: true,
            [`${tableStyles.firstChildPadding}`]: i === 0,
          })}
          key={`td-${identifier}-${i}`}
        >
          <Box
            className={cn({
              [`${tableStyles.rowContent}`]: hasMaxWidth,
            })}
            key={`td-${identifier}-${i}`}
          >
            {item}
          </Box>
        </td>
      ))}
    </tr>
  )
}

export default TableBody
