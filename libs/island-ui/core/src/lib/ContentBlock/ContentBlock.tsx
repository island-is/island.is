import React, { ReactNode } from 'react'
import { Box } from '../Box/Box'
import * as styles from './ContentBlock.css'

/** ContentBlock is a container with a set max-width that centers its children. */
export interface ContentBlockProps {
  children: ReactNode
  width?: keyof typeof styles.width
}

export const ContentBlock = ({
  width = 'large',
  children,
}: ContentBlockProps) => (
  <Box className={[styles.root, styles.width[width]]}>{children}</Box>
)
