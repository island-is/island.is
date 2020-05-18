import React, { ReactNode } from 'react'
import { Box } from '../Box/Box'
import * as styleRefs from './ContentBlock.treat'

export interface ContentBlockProps {
  children: ReactNode
  width?: keyof typeof styleRefs.width
}

export const ContentBlock = ({
  width = 'medium',
  children,
}: ContentBlockProps) => {
  const styles = {
    ...styleRefs,
  }

  return <Box className={[styles.root, styles.width[width]]}>{children}</Box>
}
