import React, { ComponentPropsWithoutRef } from 'react'
import { Box } from '@island.is/island-ui/core'
import {
  useDynamicShadow,
  UseDynamicShadowOptions,
} from '../../hooks/useDynamicShadow'
import * as styles from './ShadowBox.css'

interface ShadowBoxProps
  extends ComponentPropsWithoutRef<typeof Box>,
    Pick<UseDynamicShadowOptions, 'isDisabled' | 'debug'> {}

export function ShadowBox({
  children,
  isDisabled,
  debug,
  ...props
}: ShadowBoxProps) {
  const { showShadow, pxProps } = useDynamicShadow({
    isDisabled,
    debug,
  })

  return (
    <Box overflow="auto" {...props} position="relative">
      {children}
      <div {...pxProps} />
      <div className={styles.shadow({ showShadow })}></div>
    </Box>
  )
}
