import React, {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import cn from 'classnames'
import { Box, Text, Divider, DividerProps } from '@island.is/island-ui/core'
import Bullet from '../../components/Bullet/Bullet'
import { Colors, theme } from '@island.is/island-ui/theme'
import * as styles from './Sidebar.treat'

type ColorConfig = {
  main: Colors
  secondary: Colors
  subNavBorder: Colors
  divider: DividerProps['weight']
}

const ColorConfig: { [key: string]: ColorConfig } = {
  standard: {
    main: 'blue400',
    secondary: 'dark400',
    divider: 'regular',
    subNavBorder: 'blue200',
  },
  gradient: {
    main: 'white',
    secondary: 'blue100',
    divider: 'purple400',
    subNavBorder: 'blue400',
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
  const containerRef = useRef(null)
  const [divStyles, setDivStyles] = useState(null)
  const [bullet, bulletRef] = useState(null)
  const colors = ColorConfig[type]

  const onResize = useCallback(() => {
    if (containerRef?.current) {
      setDivStyles({
        position: 'absolute',
        top: containerRef.current.offsetTop + 'px',
        left: containerRef.current.offsetLeft + 'px',
        width: containerRef.current.offsetWidth + 'px',
        bottom: theme.spacing[12] + 'px',
      })
    }
  }, [containerRef])

  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [onResize])

  return (
    <div ref={containerRef} className={styles.container}>
      <div style={divStyles}>
        <div className={styles.sticky}>
          <div className={styles.stickyInner}>
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
            <Box position="relative">
              <Box paddingX={4} paddingY={3}>
                {title && (
                  <>
                    <Text variant="h3" as="h3" color={colors.main}>
                      {title}
                    </Text>
                    <Box paddingY={2}>
                      <Divider weight={colors.divider} />
                    </Box>
                  </>
                )}
                {children({ bulletRef, colors })}
              </Box>
            </Box>
            {bullet && <Bullet align="left" top={bullet.offsetTop + 'px'} />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
