import { Tag, Box } from '@island.is/island-ui/core'
import React from 'react'
import * as styles from './FilterTag.css'

interface FilterTagProps {
  onClick?: () => void
}

export const FilterTag: React.FC<React.PropsWithChildren<FilterTagProps>> = ({
  children,
  onClick,
}) => {
  return (
    <Tag onClick={onClick}>
      <Box flexDirection="row" alignItems="center">
        {children}
        <span className={styles.crossmark}>&#10005;</span>
      </Box>
    </Tag>
  )
}

export default FilterTag
