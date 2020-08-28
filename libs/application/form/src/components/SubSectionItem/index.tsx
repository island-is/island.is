import React, { FC } from 'react'
import * as styles from './SubSectionItem.treat'
import { Icon, Typography, Box } from '@island.is/island-ui/core'

interface SubSectionItemProps {
  currentState: 'active' | 'previous' | 'next'
  children: React.ReactNode
}

export const SubSectionItem: FC<SubSectionItemProps> = ({
  currentState,
  children,
}) => (
  <Typography
    variant="p"
    as="span"
    color={
      currentState === 'active'
        ? 'blue400'
        : currentState === 'previous'
        ? 'dark200'
        : 'dark400'
    }
  >
    <Box display="flex">
      <Box display="flex">
        <span className={styles.bullet}>
          <span className={styles.icon}>
            <Icon type="bullet" color="blue300" width="8" height="8" />
          </span>
        </span>
      </Box>
      <Box>
        <span
          className={
            currentState === 'active'
              ? styles.textActive
              : currentState === 'previous'
              ? styles.textPrevious
              : styles.textNext
          }
        >
          {children}
        </span>
      </Box>
    </Box>
  </Typography>
)

export default SubSectionItem
