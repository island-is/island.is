import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const subTabItem = style({
  border: `${theme.border.radius.standard} solid ${theme.color.transparent}`,
  borderRadius: `${theme.border.radius.large}`,
  padding: `${theme.spacing[1]}px ${theme.spacing[3]}px`,
  margin: '-1px 0',
  selectors: {
    '&:first-child': {
      marginLeft: '-3px',
    },
    '&:last-child': {
      marginRight: '-3px',
    },
  },
})

export const activeSubTabItem = style({
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.standard,
  //overwrite focusable box
  ':hover': {
    borderColor: theme.color.blue200,
  },
})

export const inactiveSubTabItem = style({
  ':hover': {
    backgroundColor: 'white',
    borderColor: theme.color.blue100,
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
