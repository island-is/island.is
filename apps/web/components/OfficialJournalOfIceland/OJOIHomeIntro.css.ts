import { style } from '@vanilla-extract/css'

import { spacing, theme } from '@island.is/island-ui/theme'

export const introSummary = style({})

export const introBody = style({
  paddingTop: spacing[2],
  paddingBottom: spacing[2],
  maxHeight: '50em',
  overflow: 'hidden',
  transition: 'all 500ms ease-in, padding 100ms',

  selectors: {
    '[hidden]&': {
      padding: 0,
      maxHeight: 0,
      display: 'block',
      visibility: 'hidden',
      transition: 'all 400ms ease-in, padding 100ms 400ms',
    },
  },
})

export const introImage = style({
  marginBottom: -spacing[2],
  maxHeight: '17em',
  display: 'block',
  margin: 'auto',
  width: '100%',
})

export const searchBox = style({
  outline: 'none',
  padding: `8px 0 2px ${theme.spacing[2]}px`,
  fontSize: '24px',
  fontWeight: theme.typography.light,
  backgroundColor: theme.color.blue100,
  border: 0,
  color: theme.color.black,
  width: '100%',
})
