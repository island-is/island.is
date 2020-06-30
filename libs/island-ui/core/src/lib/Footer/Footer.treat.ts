import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { responsiveStyleMap } from '../../utils/responsiveStyleMap'

export const footer = style({
  marginTop: 'auto',
})

export const link = responsiveStyleMap({
  fontSize: {
    xs: 20,
    sm: 18,
  },
  fontWeight: theme.typography.light,
  lineHeight: 1.416667,
  color: theme.color.blue100,
  ':hover': {
    textDecorationColor: theme.color.blue100,
  },
})

export const linkLarge = responsiveStyleMap({
  fontSize: {
    xs: 20,
    xl: 24,
  },
  fontWeight: theme.typography.light,
  lineHeight: 1.416667,
  color: theme.color.blue100,
  ':hover': {
    textDecorationColor: theme.color.blue100,
  },
})

export const icon = style({
  pointerEvents: 'none',
  opacity: 0,
  display: 'inline',
  marginLeft: '8px',
  overflow: 'visible',
  transition: 'opacity 150ms ease',
  selectors: {
    [`${link}:hover &, ${linkLarge}:hover &`]: {
      opacity: 1,
    },
  },
})
