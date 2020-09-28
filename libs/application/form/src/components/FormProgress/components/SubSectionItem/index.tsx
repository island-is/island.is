import React, { FC } from 'react'
import * as styles from './SubSectionItem.treat'
import { Icon, Typography, Box } from '@island.is/island-ui/core'
import SectionNumberColumn from '../SectionNumberColumn'

interface SubSectionItemProps {
  currentState: 'active' | 'previous' | 'next'
  showIcon?: boolean
  children: React.ReactNode
}

export const SubSectionItem: FC<SubSectionItemProps> = ({
  currentState,
  showIcon = false,
  children,
}) => (
  <Box display="flex" marginTop={1}>
    <SectionNumberColumn>
      {showIcon && (
        <span className={styles.bullet}>
          <span className={styles.icon}>
            <Icon type="bullet" color="purple200" width="8" height="8" />
          </span>
        </span>
      )}
    </SectionNumberColumn>

    <Typography
      variant={
        currentState === 'active'
          ? 'formProgressSectionActive'
          : 'formProgressSection'
      }
      as="span"
    >
      {children}
    </Typography>
  </Box>
)

export default SubSectionItem
