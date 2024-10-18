import React from 'react'
import { MenuStateReturn } from 'reakit/Menu'

interface HoverPropsRefState {
  hoverCount: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hideTimeout?: ReturnType<typeof setTimeout>
}

const MENU_LEAVE_DELAY = 500
export const useMenuHoverProps = (
  menu: MenuStateReturn,
  openOnHover: boolean,
) => {
  const hoverRef = React.useRef<HoverPropsRefState>({
    hoverCount: 0,
    hideTimeout: undefined,
  })
  const hoverState = hoverRef.current

  return openOnHover
    ? {
        onMouseEnter: () => {
          hoverState.hoverCount++
          if (hoverState.hoverCount === 1) {
            clearTimeout(hoverState.hideTimeout)
            menu.show()
          }
        },
        onMouseLeave: () => {
          hoverState.hoverCount--
          if (hoverState.hoverCount === 0) {
            hoverState.hideTimeout = setTimeout(() => {
              menu.hide()
            }, MENU_LEAVE_DELAY)
          }
        },
        unstable_autofocusOnhide: 'false',
      }
    : undefined
}
