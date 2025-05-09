import { style } from '@vanilla-extract/css'

export const gridContainer = style({
  padding: `0`,
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  columnGap: '24px',
  rowGap: '32px',
  minHeight: '184px',
  '@media': {
    'screen and (max-width: 1024px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
      columnGap: '16px',
      rowGap: '24px',
    },
    'screen and (max-width: 640px)': {
      gridTemplateColumns: '1fr',
      columnGap: '0',
      rowGap: '16px',
    },
  },
})
