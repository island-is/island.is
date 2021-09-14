import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const wrapper = style({
  marginBottom: theme.spacing[12],
  overflowX: 'auto',
})

export const tableContainer = style({
  marginBottom: theme.spacing[3],
  marginRight: -theme.spacing[2],
  marginLeft: -theme.spacing[2],
  whiteSpace: 'nowrap',
})

export const emptyTableContainer = style({
  marginBottom: theme.spacing[2],
  marginRight: -theme.spacing[2],
  marginLeft: -theme.spacing[2],
})

export const tablePadding = style({
  paddingRight: theme.spacing[9],
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
})

export const link = style({
  transition: 'background-color ease 250ms',
  borderRadius: theme.spacing[1],
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.purple100,
    },
  },
})

export const tableBody = style({
  selectors: {
    '&:hover': {
      cursor: 'pointer',
    },
  },
})

export const firstChildPadding = style({
  paddingLeft: theme.spacing[2],
})

export const showIcon = style({
  opacity: 1,
})
