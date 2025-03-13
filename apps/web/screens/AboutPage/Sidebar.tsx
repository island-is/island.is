import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

import { Box } from '@island.is/island-ui/core'
import { theme } from '@island.is/island-ui/theme'

import * as styles from './Sidebar.css'

export interface SidebarProps {
  children: ReactNode
}

const Sidebar = ({ children }: SidebarProps) => {
  const containerRef = useRef(null)
  const [divStyles, setDivStyles] = useState(null)

  const onResize = useCallback(() => {
    if (containerRef?.current) {
      setDivStyles({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        position: 'absolute',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        top: containerRef.current.offsetTop + 'px',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        left: containerRef.current.offsetLeft + 'px',
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        width: containerRef.current.offsetWidth + 'px',
        bottom: theme.spacing[12] + 'px',
        zIndex: 10,
      })
    }
  }, [containerRef])

  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  return (
    <div
      ref={containerRef}
      className={styles.container}
      role="menu"
      aria-orientation="vertical"
    >
      <div
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore make web strict
        style={divStyles}
      >
        <div className={styles.sticky}>
          <div className={styles.stickyInner}>
            <Box position="relative">{children}</Box>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
