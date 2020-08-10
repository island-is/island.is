import React, { FC, ReactNode, MouseEvent, createRef } from 'react'
import cn from 'classnames'
import {
  Box,
  Typography,
  Divider,
  DividerProps,
} from '@island.is/island-ui/core'
import Bullet from '../../components/Bullet/Bullet'
import { Colors } from '@island.is/island-ui/theme'
import useBoundingClientRect from '../../hooks/useBoundingClientRect'
import * as styles from './Sidebar.treat'

type ColorConfig = {
  main: Colors
  secondary: Colors
  divider: DividerProps['weight']
}

const ColorConfig: { [key: string]: ColorConfig } = {
  standard: {
    main: 'blue400',
    secondary: 'dark400',
    divider: 'regular',
  },
  gradient: {
    main: 'white',
    secondary: 'blue100',
    divider: 'purple400',
  },
}

export interface SidebarProps {
  title: string
  type: keyof typeof ColorConfig
  children: (p: {
    bulletRef: (e: HTMLElement) => void
    colors: ColorConfig
  }) => ReactNode
}

const Sidebar: FC<SidebarProps> = ({ title, type, children }) => {
  const [containerRef, containerRect] = useBoundingClientRect()
  const [bulletRef, bulletRect] = useBoundingClientRect()

  const isFixed = containerRect && containerRect.top < 0
  const colors = ColorConfig[type]

  return (
    <div ref={containerRef} className={styles.parent}>
      <div
        className={cn(
          styles.container,
          isFixed ? styles.containerFixed : styles.containerAbsolute,
        )}
        style={isFixed ? { left: containerRect.left } : {}}
      >
        {bulletRect && (
          <Bullet
            align="left"
            top={
              bulletRect
                ? bulletRect.top - Math.max(0, containerRect.top) + 'px'
                : 0
            }
          />
        )}
        <div
          className={cn(styles.background, {
            [styles.visible]: type === 'standard',
          })}
        />
        <div
          className={cn(styles.background, styles.gradient, {
            [styles.visible]: type === 'gradient',
          })}
        />
        <Box paddingX={4} paddingY={3}>
          {title && (
            <>
              <Typography variant="h3" as="h3" color={colors.main}>
                {title}
              </Typography>
              <Box paddingY={2}>
                <Divider weight={colors.divider} />
              </Box>
            </>
          )}
          {children({ bulletRef, colors })}
        </Box>
      </div>
    </div>
  )
}

export default Sidebar
