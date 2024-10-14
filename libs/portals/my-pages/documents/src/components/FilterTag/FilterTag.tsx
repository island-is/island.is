import React, { FC } from 'react'
import { Box, Tag, Icon } from '@island.is/island-ui/core'

import * as styles from './FilterTag.css'

interface Props {
  title?: string
  onClick?: () => void
}

export const FilterTag: FC<React.PropsWithChildren<Props>> = ({
  onClick,
  title,
}) => {
  return (
    <Box className={styles.tag}>
      <Tag onClick={onClick}>
        {title}
        <Icon
          className={styles.icon}
          type="outline"
          icon="close"
          size="small"
        />
      </Tag>
    </Box>
  )
}

export default FilterTag
