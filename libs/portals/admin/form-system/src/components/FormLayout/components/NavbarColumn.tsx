import { Box } from '@island.is/island-ui/core'
import { useCallback, useContext, useLayoutEffect, useRef } from 'react'
import { ControlContext } from '../../../context/ControlContext'
import { NavbarSelectStatus } from '../../../lib/utils/interfaces'
import { Navbar } from '../../Navbar/Navbar'
import * as navbarStyles from '../../Navbar/Navbar.css'
import { NavbarSelect } from '../../NavbarSelect/NavbarSelect'

export const NavbarColumn = () => {
  const { selectStatus } = useContext(ControlContext)
  const scrollRef = useRef<HTMLDivElement>(null)
  const sharedScrollY = useRef(0)
  const mode = selectStatus !== NavbarSelectStatus.OFF ? 'select' : 'normal'
  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    sharedScrollY.current = (e.currentTarget as HTMLDivElement).scrollTop
  }, [])

  useLayoutEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const y = sharedScrollY.current
    const apply = () => {
      const maxY = Math.max(0, el.scrollHeight - el.clientHeight)
      el.scrollTop = Math.min(y, maxY)
    }

    apply()
    requestAnimationFrame(apply)
  }, [mode])

  return (
    <Box
      ref={scrollRef}
      className={navbarStyles.minimalScrollbar}
      onScroll={onScroll}
    >
      {mode === 'select' ? <NavbarSelect /> : <Navbar />}
    </Box>
  )
}
