import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const filesLink = style({
  display: 'block',
  gridColumn: '1/-1',
  borderRadius: theme.spacing[1],
  backgroundColor: theme.color.purple100,
  marginBottom: theme.spacing[2],
  transition: 'background-color ease 250ms',
  selectors: {
    '&:hover': {
      cursor: 'pointer',
      backgroundColor: theme.color.purple200,
      textDecoration: 'none !important',
    },
  },
})

export const container = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  columnGap: theme.spacing[3],
  padding: `${theme.spacing[2]}px ${theme.spacing[0]}px`,
  alignItems: 'center',
})

export const type = style({
  display: 'block',
  backgroundColor: theme.color.white,
  borderRadius: '2px',
  padding: theme.spacing[1],
  maxWidth: theme.spacing[6],
  justifySelf: 'center',
})

export const name = style({
  gridColumn: 'span 2',
  overflow: 'hidden',
})
