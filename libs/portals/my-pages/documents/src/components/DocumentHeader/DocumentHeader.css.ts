import { theme } from '@island.is/island-ui/theme'
import { SERVICE_PORTAL_HEADER_HEIGHT_LG } from '@island.is/portals/my-pages/constants'
import { globalStyle, style } from '@vanilla-extract/css'

export const container = style({
  top: SERVICE_PORTAL_HEADER_HEIGHT_LG,
  width: '100%',
  zIndex: 100,
})

export const categoryDivider = style({
  position: 'relative',
  display: 'flex',
  selectors: {
    '&::before': {
      content: "''",
      position: 'relative',
      top: '0.125rem',
      height: '1rem',
      width: 1,
      margin: '0 1rem',
      background: theme.color.blue200,
    },
  },
})

export const actionContainer = style({
  ':hover': {
    cursor: 'pointer',
  },
})
export const actionBarWrapper = style({
  display: 'flex',
  alignSelf: 'center',
  alignItems: 'center',
  marginLeft: 'auto',
})

export const titleText = style({})

globalStyle(`${titleText} p`, {
  opacity: 0.8,
})
