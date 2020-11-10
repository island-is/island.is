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

const smallSpacing = theme.spacing[1]
const spacing = theme.spacing[3]

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
  margin: `${spacing}px auto`,
  maxWidth: '1000px',
  width: '100%',
  opacity: 0,
  outline: 0,
  transition: `opacity 250ms ease-in-out, transform 250ms ease-in-out`,
  selectors: {
    '&[data-enter]': {
      opacity: 1,
    },
  },
})

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  backgroundColor: 'white',
  filter: `drop-shadow(0 4px 70px rgba(0, 97, 255, 0.1))`,
})

export const close = style({
  position: 'absolute',
  top: smallSpacing,
  right: smallSpacing,
})
