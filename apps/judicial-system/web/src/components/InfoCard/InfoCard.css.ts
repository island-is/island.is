import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const infoCardContainer = style({
  background: theme.color.blue100,
  borderRadius: theme.border.radius.large,
})

export const infoCardTitleContainer = style({
  borderBottom: `2px solid ${theme.color.blue200}`,
})

export const infoCardDataContainer = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      display: 'flex',
      flexWrap: 'wrap',
    },
  },
})

export const infoCardData = style({
  flex: '50%',
})
