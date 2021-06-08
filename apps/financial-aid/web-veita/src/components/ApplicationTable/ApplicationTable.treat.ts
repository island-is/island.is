import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const tableContainer = style({
  // borderCollapse: 'separate',
  // borderSpacing: `0px ${theme.spacing[4]}px`,
  marginBottom: theme.spacing[4],
  marginRight: -theme.spacing[2],
  marginLeft: -theme.spacing[2],
})

export const tablePadding = style({
  paddingRight: theme.spacing[4],
  paddingTop: theme.spacing[2],
  paddingBottom: theme.spacing[2],
})

export const link = style({
  transition: 'backgroundColor ease 250ms',
  borderRadius: theme.spacing[1],
  // margin: -theme.spacing[2],
  // padding: theme.spacing[2],

  // position: 'relative',
  // ':after': {
  //   content: '""',
  //   position: 'absolute',
  //   display: 'block',
  //   height: 'calc(100% + 32px)',
  //   width: 'calc(100% + 32px)',
  //   left: '0px',
  //   right: -theme.spacing[2],
  //   backgroundColor: theme.color.purple100,
  //   top: -theme.spacing[2],
  //   zIndex: '-1',
  // },
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
