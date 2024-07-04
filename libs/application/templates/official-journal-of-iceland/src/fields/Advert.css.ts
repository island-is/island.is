import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const inputWrapper = style({
  width: '50%',

  '@media': {
    [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
      width: '100%',
    },
  },
})
export const modalBase = style({
  height: '100%',
  display: 'block',
})
export const modalContainer = style({
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(255, 255, 255, 0.5)',
})

export const modal = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing[4],
  padding: theme.spacing[3],
  maxWidth: '888px',
  height: '90vh',
  width: '100%',
  overflowY: 'auto',
  borderRadius: theme.border.radius.large,
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.16)',
  background: theme.color.white,
})

export const contentWrapper = style({
  width: '80%',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing[2],
})

export const buttonWrapper = style([
  contentWrapper,
  {
    paddingTop: theme.spacing[3],
    flexWrap: 'wrap',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
])

globalStyle(`${contentWrapper} label`, {
  alignItems: 'center',
})

globalStyle(`${contentWrapper} button`, {
  paddingInline: theme.spacing[7],
})
