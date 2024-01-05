import React, { FC } from 'react'
import cn from 'classnames'

import { Box } from '../../Box/Box'
import * as styles from './SectionNumberColumn.css'

interface SectionNumberColumnProps {
  children?: React.ReactNode
  type?: 'section' | 'subSection'
}

export const SectionNumberColumn: FC<
  React.PropsWithChildren<SectionNumberColumnProps>
> = ({ children, type = 'section' }) => (
  <Box
    position="relative"
    display="flex"
    alignItems="center"
    justifyContent="center"
    marginRight={[1, 1, 2]}
    className={cn(styles.root, {
      [styles.rootSubSection]: type === 'subSection',
    })}
  >
    {children}
  </Box>
)
