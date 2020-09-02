import React, { FC } from 'react'
import * as styles from './SubSectionItem.treat'
import { Icon, Typography, Box } from '@island.is/island-ui/core'
import SectionNumberColumn from '../SectionNumberColumn'

interface SubSectionItemProps {
  currentState: 'active' | 'previous' | 'next'
  children: React.ReactNode
}

export const SubSectionItem: FC<SubSectionItemProps> = ({
  currentState,
  children,
}) => (
  <Typography variant="p" as="span">
    <Box display="flex">
      <SectionNumberColumn>
        <span className={styles.bullet}>
          <span className={styles.icon}>
            {/* <Icon type="bullet" color="blue300" width="8" height="8" /> */}
          </span>
        </span>
      </SectionNumberColumn>
      <Typography
        variant="p"
        as="span"
        color={currentState === 'active' ? 'purple400' : undefined}
      >
        {children}
      </Typography>
    </Box>
  </Typography>
)

export default SubSectionItem
