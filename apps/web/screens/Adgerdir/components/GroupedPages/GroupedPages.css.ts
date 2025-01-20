import { style, styleVariants } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'
import covidColors from '../UI/colors'

export const container = style({
  borderRadius: theme.border.radius.large,
  borderWidth: 1,
  borderStyle: 'solid',
})

export const variants = styleVariants({
  blue: {
    borderColor: covidColors.blue200,
  },
  green: {
    borderColor: covidColors.green200,
  },
})

export const bottom = style({
  borderRadius: `0 0 ${theme.border.radius.large} ${theme.border.radius.large}`,
  selectors: {
    [`${variants.blue} &`]: {
      background: covidColors.blue100,
    },
    [`${variants.green} &`]: {
      background: covidColors.green100,
    },
  },
})
