import React, { FC } from 'react'

import { Icon } from '../../Icon/Icon'
import { Text } from '../../Text/Text'
import { Box } from '../../Box/Box'
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
    <Text
      as="span"
      lineHeight="lg"
      fontWeight={currentState === 'active' ? 'semiBold' : 'light'}
    >
      {children}
    </Text>
  </Box>
)
