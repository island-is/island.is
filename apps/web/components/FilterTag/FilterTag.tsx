import React from 'react'

import { Box, Tag } from '@island.is/island-ui/core'

import * as styles from './FilterTag.css'

interface FilterTagProps {
  onClick?: () => void
  active?: boolean
}

export const FilterTag: React.FC<React.PropsWithChildren<FilterTagProps>> = ({
  children,
  onClick,
  active,
}) => {
  return (
    <Tag onClick={onClick} active={active}>
      <Box flexDirection="row" alignItems="center">
        {children}
        <span className={styles.crossmark}>&#10005;</span>
      </Box>
    </Tag>
  )
}

export default FilterTag
