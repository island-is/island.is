import { theme } from '@island.is/island-ui/theme'
import { style } from 'treat'

export const infoBoxContainer = style({
  maxWidth: '432px',
  padding: theme.spacing[2],
  border: `1px solid ${theme.color.blue200}`,
  borderRadius: theme.border.radius.large,
  background: theme.color.blue100,
})

export const dividerContainer = style({
  borderTop: `${theme.border.width.large}px solid ${theme.color.purple100}`,
  gridColumn: '1/-1',
})

export const container = style({
  paddingTop: theme.spacing[3],
  paddingBottom: theme.spacing[3],
  paddingLeft: theme.spacing[3],
  paddingRight: theme.spacing[3],
  gridColumn: '1/-1',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      paddingTop: theme.spacing[5],
      paddingBottom: theme.spacing[5],
      paddingLeft: `0px`,
      paddingRight: `0px`,
      gridColumn: '2/10',
    },
  },
})

export const desktopPreviosButton = style({
  display: 'none',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'block',
    },
  },
})

export const mobilePreviosButton = style({
  display: 'block',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'none',
    },
  },
})

export const oneButton = style({
  flexDirection: 'row-reverse',
})
