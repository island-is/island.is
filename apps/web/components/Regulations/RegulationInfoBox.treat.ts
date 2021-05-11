import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const copiedIndicator = style({
  color: theme.color.mint400,
  fontSize: '1.3em',
  lineHeight: 1,
  display: 'inline-block',
  verticalAlign: 'middle',
  paddingLeft: '.25em',

  '@keyframes': {
    '0%': { opacity: 1 },
    '100%': { opacity: 0 },
  },
  animation: '@keyframes 1000ms 300ms 1 forwards ease-in-out',
})
