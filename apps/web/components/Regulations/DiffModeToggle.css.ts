import { style } from 'treat'
import { spacing, theme } from '@island.is/island-ui/theme'

export const wrapper = style({
  float: 'right',
  textAlign: 'right',
  marginLeft: spacing[2],
  position: 'relative',
  zIndex: 1,
})

export const wrapperDisabled = style({
  pointerEvents: 'none',
  color: theme.color.dark200,
})

export const toggler = style({
  selectors: {
    '&[class]': {
      marginBottom: 0,
    },
  },
})

export const totalToggler = style({
  marginTop: spacing[1],
  fontSize: '0.75rem',
})
