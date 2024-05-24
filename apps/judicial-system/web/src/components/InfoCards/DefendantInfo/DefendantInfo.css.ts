import { style, styleVariants } from '@vanilla-extract/css'

import { theme } from '@island.is/island-ui/theme'

const baseGridRow = style({
  display: 'grid',
  gridGap: theme.spacing[1],
  marginBottom: theme.spacing[1],
})

export const gridRow = styleVariants({
  withButton: [
    baseGridRow,
    {
      gridTemplateColumns: '4fr 1fr',
      '@media': {
        [`screen and (max-width: ${theme.breakpoints.xl}lg)`]: {
          gridTemplateColumns: '1fr',
        },
      },
    },
  ],
  withoutButton: [baseGridRow, { gridTemplateColumns: '1fr' }],
})

export const infoCardDefendant = style({
  display: 'flex',
  flexDirection: 'column',

  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      display: 'block',
    },
  },
})
