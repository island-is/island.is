import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return result
    ? `${parseInt(result[1], 16)}, ` +
        `${parseInt(result[2], 16)}, ` +
        `${parseInt(result[3], 16)}`
    : null
}

const spacing = theme.spacing[2]

export const backdrop = style({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
  backgroundColor: `rgba(${hexToRgb(theme.color.blue100)}, 0.7)`,
  transition: `opacity 250ms ease-in-out`,
  opacity: 0,
  zIndex: 10000,
  selectors: {
    '&[data-enter]': {
      opacity: 1,
    },
  },
})

export const dialog = style({
  display: 'flex',
  margin: `0 auto`,
  position: 'absolute',
  borderRadius: theme.border.radius.large,
  overflow: 'hidden',
  top: spacing,
  right: spacing,
  bottom: spacing,
  left: spacing,
  opacity: 0,
  backgroundColor: theme.color.white,
  outline: 0,
  transition: `opacity 250ms ease-in-out, transform 250ms ease-in-out`,
  selectors: {
    '&[data-enter]': {
      opacity: 1,
    },
  },
})

export const close = style({
  position: 'absolute',
  top: spacing,
  right: spacing,
  lineHeight: 0,
  outline: 0,
  zIndex: 101,
  ':before': {
    content: '""',
    position: 'absolute',
    top: -spacing,
    left: -spacing,
    right: -spacing,
    bottom: -spacing,
  },
})

export const head = style({
  height: 64,
})

export const heading = style({
  display: 'inline-block',
  maxWidth: '80%',
})

export const iframe = style({
  position: 'absolute',
  top: 64,
  left: 0,
  right: 0,
  bottom: 0,
  height: '100%',
  width: '100%',
  border: 0,
  zIndex: 100,
  margin: 0,
  padding: 0,
})
