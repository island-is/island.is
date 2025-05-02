import React from 'react'

import { Box, Tag, type TagProps } from '@island.is/island-ui/core'

import * as styles from './FilterTag.css'

interface FilterTagProps {
  onClick?: () => void
  active?: boolean
  variant?: TagProps['variant']
}

export const FilterTag: React.FC<React.PropsWithChildren<FilterTagProps>> = ({
  children,
  onClick,
  active,
  variant,
}) => {
  return (
    <Tag onClick={onClick} active={active} variant={variant}>
      <Box flexDirection="row" alignItems="center">
        {children}
        <span className={styles.crossmark}>&#10005;</span>
      </Box>
    </Tag>
  )
}

export default FilterTag
