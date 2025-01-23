import React, { MouseEventHandler, ReactNode } from 'react'

import { Box, FocusableBox } from '@island.is/island-ui/core'

import * as styles from './Comparison.css'

type ColorScheme = 'blue' | 'red'

interface ComparisonProps {
  children?: ReactNode
  colorScheme?: ColorScheme
  href?: string
  onClick?: MouseEventHandler
}

const colorSchemes = {
  blue: {
    backgroundColor: 'blue100',
    textColor: 'blue400',
    tagVariant: 'darkerBlue',
    bordered: false,
  },
  red: {
    backgroundColor: 'red100',
    textColor: 'red600',
    tagVariant: 'red',
    bordered: true,
  },
} as const

export const Comparison: React.FC<React.PropsWithChildren<ComparisonProps>> = ({
  children,
  colorScheme = 'blue',
  href,
  onClick,
}) => {
  return (
    <FocusableBox
      alignItems="center"
      background={colorSchemes[colorScheme].backgroundColor}
      borderRadius="large"
      display="flex"
      component="div"
      href={href}
      onClick={onClick}
      padding={[2, 2, 2]}
      position="relative"
      width="full"
    >
      <Box className={styles.wrapper}>{children}</Box>
    </FocusableBox>
  )
}
