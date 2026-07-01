import { FC } from 'react'
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

const SortButton: FC<Props> = (props) => {
  const { title, onClick, sortAsc, sortDes, isActive, dataTestid } = props

  return (
    <Box
      component="button"
      type="button"
      display="flex"
      alignItems="center"
      className={styles.thButton}
      onClick={onClick}
      aria-label={`Raða eftir dálki: ${title}`}
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
        aria-hidden
      >
        <Icon icon="caretDown" size="small" />
      </Box>
    </Box>
  )
}

export default SortButton
