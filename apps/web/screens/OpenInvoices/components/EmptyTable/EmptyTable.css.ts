import { style } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

export const emptyTable = style({
  paddingBlock: 66,
  position: 'relative',
  opacity: 0.5,
  display: 'flex',
  justifyContent: 'center',
  borderBottom: `1px solid ${theme.color.blue200}`,
  selectors: {
    '&::before': {
      content: '',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      height: 1,
      width: '100%',
      zIndex: 0,
      background: theme.color.blue200,
    },
  },
})

export const emptyTableText = style({
  paddingInline: 40,
  position: 'relative',
  textAlign: 'center',
  zIndex: 10,
  background: theme.color.white,
  fontStyle: 'italic',
})
