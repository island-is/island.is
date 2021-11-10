import React from 'react'
import { Box, Text, Button } from '@island.is/island-ui/core'

import * as tableStyles from '../../sharedStyles/Table.css'
import cn from 'classnames'
import { Colors } from '@island.is/island-ui/theme'

type TextVariants =
  | 'default'
  | 'small'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'intro'
  | 'eyebrow'

const TextTableItem = (
  variant?: TextVariants,
  text?: string | number,
  color?: Colors,
) => {
  return (
    text && (
      <Text variant={variant} color={color}>
        {text}
      </Text>
    )
  )
}

const ActivationButtonTableItem = (
  title: string,
  loading: boolean,
  onClick: () => void,
  destructiveColorScheme: boolean,
) => {
  return (
    <Box>
      <Button
        onClick={(event) => {
          event.stopPropagation()
          onClick()
        }}
        variant="text"
        loading={loading}
        colorScheme={destructiveColorScheme ? 'destructive' : 'light'}
      >
        {title}
      </Button>
    </Box>
  )
}

interface PageProps {
  items: React.ReactNode[]
  index: number
  identifier: string
  onClick?: () => void
  hasMaxWidth?: boolean
  animationDelay?: number
}

const TableBody = ({
  items,
  index,
  identifier,
  onClick,
  hasMaxWidth = true,
  animationDelay = 55,
}: PageProps) => {
  return (
    <tr
      className={cn({
        ['contentUp']: true,
        [`${tableStyles.link}`]: onClick,
      })}
      style={{ animationDelay: animationDelay + 3.5 * index + 'ms' }}
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

export { TableBody, TextTableItem, ActivationButtonTableItem }
