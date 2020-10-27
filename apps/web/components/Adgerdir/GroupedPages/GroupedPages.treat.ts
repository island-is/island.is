import { style, styleMap } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const container = style({
  borderRadius: theme.border.radius.large,
  borderWidth: 1,
  borderStyle: 'solid',
})

export const variants = styleMap({
  blue: {
    borderColor: theme.color.blue200,
  },
  purple: {
    borderColor: theme.color.purple200,
  },
  red: {
    borderColor: theme.color.red200,
  },
})

export const bottom = style({
  borderRadius: `0 0 ${theme.border.radius.large} ${theme.border.radius.large}`,
  selectors: {
    [`${variants.blue} &`]: {
      background: theme.color.blue100,
    },
    [`${variants.purple} &`]: {
      background: theme.color.purple100,
    },
    [`${variants.red} &`]: {
      background: theme.color.red100,
    },
  },
})
