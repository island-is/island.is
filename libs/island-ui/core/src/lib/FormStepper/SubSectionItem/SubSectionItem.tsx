import React, { FC } from 'react'
import cn from 'classnames'

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
  <Box display="flex" alignItems="center" marginTop={[0, 0, 1]}>
    <SectionNumberColumn className={styles.number}>
      {showIcon && (
        <span className={styles.bullet}>
          <span className={styles.icon}>
            <Icon type="bullet" color="purple200" width="8" height="8" />
          </span>
        </span>
      )}
    </SectionNumberColumn>

    <Box className={styles.name}>
      <Text
        as="span"
        lineHeight="lg"
        fontWeight={currentState === 'active' ? 'semiBold' : 'light'}
      >
        {children}
      </Text>
    </Box>
  </Box>
)
