import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const commentsList = style({
  listStyle: 'none',
})

export const iconWrapper = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  inlineSize: 32,
  blockSize: 32,
  borderRadius: '50%',
  background: theme.color.blue400,
})

export const comment = style({
  display: 'flex',
  borderBottom: `1px solid ${theme.color.blue200}`,
  padding: theme.spacing[2],
  gap: theme.spacing[2],
  selectors: {
    '&:last-child': {
      borderBottom: 'none',
    },
  },
})

export const iconColumn = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  inlineSize: 32,
})

export const dateColumn = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
})

export const contentColumn = style({
  flex: 1,
})
