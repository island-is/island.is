import { globalStyle, style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const productSearchInput = style({
  height: '80px',
})

export const description = style({})

export const descriptionList = style({
  listStyleType: 'disc',
  paddingLeft: '1.5em',
})

// Description HTML can contain bold markup (tags or inline styles)
globalStyle(`${description} *`, {
  fontWeight: 'inherit !important',
})

globalStyle(`${description} a`, {
  color: theme.color.blue400,
  textDecoration: 'underline',
})

export const chevronForward = style({
  width: '14px',
  height: '14px',
  marginLeft: '6px',
  marginRight: '6px',
})

export const categoryOption = style({
  ':hover': {
    backgroundColor: theme.color.blue100,
  },
})
