import { globalStyle, style } from '@vanilla-extract/css'
import { theme } from '@island.is/island-ui/theme'

export const grid = style({
  padding: `0 ${theme.spacing[1]}px`,
})

export const col = style({
  paddingBottom: theme.spacing[3],
})

export const wrapper = style({
  padding: `${theme.spacing[1]}px`,
  wordBreak: 'break-word',
  selectors: {
    '&:nth-child(2n-1)': {
      background: '#fff',
    },
  },
})

export const label = style({
  wordBreak: 'break-word',
  width: '55%',
})

export const detailsGrid = style({
  overflow: 'hidden',
  width: 'auto',
  marginLeft: '2px',
  maxWidth: '90vw',
})

export const zebraTable = style({})

globalStyle(`${zebraTable} tbody tr:nth-child(2n-1)`, {
  background: '#fff',
})

export const scrollBox = style({
  overflowX: 'auto',
  maxWidth: '85vw',
})
