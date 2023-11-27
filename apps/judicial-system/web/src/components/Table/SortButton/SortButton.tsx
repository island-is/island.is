import React from 'react'
import cn from 'classnames'

import { Box, Icon, Text } from '@island.is/island-ui/core'

import * as styles from '../Table.css'

interface Props {
  title: string
  onClick: () => void
  sortAsc: boolean
  sortDes: boolean
  isActive: boolean
  dataTestid?: string
}

const SortButton: React.FC<Props> = (props) => {
  const { title, onClick, sortAsc, sortDes, isActive, dataTestid } = props

  return (
    <Box
      component="button"
      display="flex"
      alignItems="center"
      className={styles.thButton}
      onClick={onClick}
      data-testid={dataTestid}
    >
      <Text fontWeight={isActive ? 'semiBold' : 'regular'}>{title}</Text>
      <Box
        className={cn(styles.sortIcon, {
          [styles.sortAsc]: sortAsc,
          [styles.sortDes]: sortDes,
        })}
        marginLeft={1}
        component="span"
        display="flex"
        alignItems="center"
      >
        <Icon icon="caretDown" size="small" />
      </Box>
    </Box>
  )
}

export default SortButton
