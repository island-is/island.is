import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const subTabItem = style({
  margin: `0 ${theme.spacing.smallGutter}px`,
  padding: `${theme.spacing[1]}px ${theme.spacing[2]}px`,
  selectors: {
    '&:last-child': {
      marginRight: 0,
    },
    '&:first-child': {
      marginLeft: 0,
    },
  },
})

export const activeSubTabItem = style({})

export const inactiveSubTabItem = style({
  ':hover': {
    backgroundColor: 'white',
    color: theme.color.blue200,
  },
})

export const inactiveSubTabItemWithDivider = style({
  selectors: {
    '&:not(:last-child):after': {
      content: '""',
      position: 'absolute',
      width: 1,
      margin: `${theme.spacing[1]}px 0`,
      backgroundColor: theme.color.blue200,
      top: 0,
      bottom: 0,
      right: `-${theme.spacing.smallGutter}px`,
      zIndex: theme.zIndex.above,
    },
  },
})

globalStyle(`${inactiveSubTabItem}: hover p`, {
  color: theme.color.blue400,
})
