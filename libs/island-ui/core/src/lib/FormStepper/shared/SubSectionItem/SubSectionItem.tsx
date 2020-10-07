import React, { FC } from 'react'

import { Icon } from '../../../Icon/Icon'
import { Typography } from '../../../Typography/Typography'
import { Box } from '../../../Box'
import { SectionNumberColumn } from '../SectionNumberColumn/SectionNumberColumn'
import * as styles from './SubSectionItem.treat'

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
          ? 'formStepperSectionActive'
          : 'formStepperSection'
      }
      as="span"
    >
      {children}
    </Typography>
  </Box>
)
