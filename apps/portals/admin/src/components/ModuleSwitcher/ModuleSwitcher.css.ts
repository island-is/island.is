import { style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  // width: '290px',
  // '@media': {
  //   [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
  //     width: '100px',
  //   },
  // },
})

export const dialogDisclosure = style({})

export const dialogContainer = style({
  background: theme.color.blue100,
  position: 'fixed',
  display: 'flex',
  justifyContent: 'spaceBetween',
  flexDirection: 'column',
  inset: 0,
  padding: `0 ${theme.spacing[3]}px`,
  height: '100%',
  zIndex: theme.zIndex.modal,
})

export const dialogHeader = style({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: theme.headerHeight.small,
})
