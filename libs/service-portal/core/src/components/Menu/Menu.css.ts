import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import { zIndex } from '@island.is/service-portal/constants'

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return result
    ? `${parseInt(result[1], 16)}, ` +
        `${parseInt(result[2], 16)}, ` +
        `${parseInt(result[3], 16)}`
    : null
}

export const menu = style({
  position: 'fixed',
  top: theme.spacing['3'],
  right: theme.spacing['3'],
  left: theme.spacing['3'],
  zIndex: zIndex.menu,
  maxHeight: `calc(100vh - ${theme.spacing['6']}px)`,
  marginBottom: theme.spacing['3'],
  opacity: 0,
  overflowY: 'auto',
  visibility: 'hidden',
  transform: `translate3d(0, -${theme.spacing['2']}px, 0)`,
  filter: 'drop-shadow(0px 4px 70px rgba(0, 97, 255, 0.1))',
  transition: 'opacity 300ms, transform 200ms',
  ...themeUtils.responsiveStyle({
    md: {
      top: 'auto',
      left: 'auto',
      right: 'auto',
      width: 'auto',
      transform: `translate3d(-100%, -${theme.spacing['2']}px, 0)`,
    },
  }),
})

export const overlay = style({
  opacity: 0,
  visibility: 'hidden',
  transition: 'opacity 300ms',
  backgroundColor: `rgba(${hexToRgb(theme.color.dark400)}, 0.2)`,
  zIndex: zIndex.menu - 1,
})

export const isOpen = style({
  opacity: 1,
  visibility: 'visible',
  transform: `translate3d(0%, 0px, 0px)`,
  ...themeUtils.responsiveStyle({
    md: {
      transform: `translate3d(-100%, 0px, 0)`,
    },
  }),
})

export const overlayIsOpen = style({
  zIndex: 1,
  opacity: 1,
  visibility: 'visible',
})

export const closeButton = style({
  position: 'absolute',
  top: theme.spacing['1'],
  right: theme.spacing['1'],
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: 44,
  height: 44,
  cursor: 'pointer',
  border: '1px solid transparent',
  backgroundColor: theme.color.white,
  borderRadius: '100%',
  transition: 'background-color 250ms, border-color 250ms',
  ':hover': {
    backgroundColor: theme.color.dark100,
  },
  ':focus': {
    outline: 'none',
    borderColor: theme.color.mint200,
  },
})
