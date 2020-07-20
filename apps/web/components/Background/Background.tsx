import React, { FC } from 'react'
import * as styles from './Background.treat'
import { Box, UseBoxStylesProps } from '@island.is/island-ui/core'

export interface BackgroundProps {
  type?: keyof typeof styles
  color?: UseBoxStylesProps['background']
}

export const Background: FC<BackgroundProps> = ({ type, color, children }) => (
  <Box background={color} className={styles[type]}>
    {children}
  </Box>
)

export default Background
