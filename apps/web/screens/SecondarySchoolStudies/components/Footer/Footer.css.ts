import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const footer = style({
  backgroundColor: '#003D85',
  padding: '24px',
  display: 'flex',
  justifyContent: 'space-between',
  height: '128px',
})

export const mobileFooter = style({
  backgroundColor: '#003D85',
  padding: '24px',
  display: 'flex',
  justifyContent: 'space-between',
})

export const footerContent = style({
  display: 'flex',
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '32px',
})

export const logo = style({
  width: '53px',
  height: '55px',
  objectFit: 'contain',
  flexShrink: 0,
})

export const linksSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '24px',
  alignItems: 'center',
  rowGap: '0px',
})

export const buttonsSection = style({
  display: 'flex',
  gap: '16px',
  flexShrink: 0,
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {},
  },
})

export const link = style({
  textDecoration: 'none',
  ':hover': {
    textDecoration: 'underline',
  },
})
