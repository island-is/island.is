import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { STICKY_NAV_HEIGHT } from '@island.is/web/constants'
import { theme } from '@island.is/island-ui/theme'

interface Props {
  top?: number
  constantSticky?: boolean
  childOfFlexBox?: boolean
}

export const Sticky: FC<Props> = ({
  children,
  constantSticky = false,
  childOfFlexBox = false,
  top = STICKY_NAV_HEIGHT + theme.spacing[1],
}) => {
  const ref = useRef<HTMLDivElement | null>(null)
  const [usesSticky, setUsesSticky] = useState<boolean>(constantSticky)

  const onResize = useCallback(() => {
    if (
      ref?.current &&
      !constantSticky &&
      ref.current.offsetHeight < window.innerHeight - STICKY_NAV_HEIGHT
    ) {
      setUsesSticky(true)
    }
  }, [ref])

  useEffect(() => {
    onResize()
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [onResize])

  return (
    <div
      ref={ref}
      style={{
        alignSelf: 'flex-start',
        top,
        ...(usesSticky && { position: 'sticky' }),
      }}
    >
      {children}
    </div>
  )
}

export default Sticky
