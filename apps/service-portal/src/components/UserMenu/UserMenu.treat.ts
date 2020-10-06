import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const wrapper = style({
  ...themeUtils.responsiveStyle({
    md: {
      width: 266,
    },
  }),
})

export const avatar = style({
  width: 56,
  height: 56,
  marginRight: theme.spacing['3'],
  backgroundSize: 'cover',
  borderRadius: '100%',
})

export const closeButton = style({
  alignSelf: 'flex-start',
  marginLeft: 'auto',
  marginTop: -theme.spacing['1'],
  marginRight: -theme.spacing['1'],
  cursor: 'pointer',
  transition: 'transform 200ms',
  ':hover': {
    transform: 'scale(1.3)',
  },
})
