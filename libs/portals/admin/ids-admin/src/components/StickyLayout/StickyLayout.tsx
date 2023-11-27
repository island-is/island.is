import React, { useRef } from 'react'
import { useIntersection } from 'react-use'

import { Box, ResponsiveProp, Space } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './StickyLayout.css'

interface StickyLayoutProps {
  children: React.ReactNode
  header: React.ReactNode | ((isIntersecting?: boolean) => React.ReactNode)
  headerMarginBottom?: ResponsiveProp<Space | 'auto'>
}

export const StickyLayout = ({
  children,
  header,
  headerMarginBottom = 4,
}: StickyLayoutProps) => {
  const mainElmRef = useRef<HTMLDivElement>(null)
  const isIntersecting =
    (
      useIntersection(mainElmRef, {
        rootMargin: '0% 0% -100% 0%',
        threshold: 0,
      }) || {}
    ).isIntersecting || undefined

  return (
    <div ref={mainElmRef}>
      <Box
        position={'sticky'}
        top={0}
        style={{ zIndex: theme.zIndex.belowHeader, marginTop: -16 }}
        marginBottom={headerMarginBottom}
      >
        <Box paddingY={['p2', 2]} background="white" position="relative">
          {typeof header === 'function' ? header(isIntersecting) : header}
        </Box>
        <div
          className={styles.shadow}
          style={{ opacity: isIntersecting ? 1 : 0 }}
        />
      </Box>
      {children}
    </div>
  )
}
