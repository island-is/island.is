import { style } from 'treat'
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

export const modal = style({
  position: 'relative',
  top: '50%',
  maxHeight: '80%',
  margin: 'auto',
  borderRadius: theme.border.radius.large,
  overflowY: 'auto',
  transform: 'translate3d(0, -50%, 0)',
  ...themeUtils.responsiveStyle({
    md: {
      width: '90%',
    },
    lg: {
      width: 828,
    },
  }),
})

export const overlay = style({
  transition: 'opacity 300ms',
  backgroundColor: `rgba(${hexToRgb(theme.color.dark400)}, 0.2)`,
  zIndex: zIndex.modal - 1,
  '@keyframes': {
    from: {
      opacity: 0,
    },
    to: {
      opacity: 1,
    },
  },
  animationTimingFunction: 'ease-out',
  animationDuration: '0.25s',
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
