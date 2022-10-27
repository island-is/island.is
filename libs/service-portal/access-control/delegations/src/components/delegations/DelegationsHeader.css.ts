import { style } from '@vanilla-extract/css'
import { themeUtils, theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(220px, 70%) minmax(100px, 30%)',
  gridTemplateAreas: `"select button" "search search"`,
  gridTemplateRows: '1fr',
  alignItems: 'end',
  gridColumnGap: theme.spacing[2],
  gridRowGap: theme.spacing[2],
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateColumns:
        'minmax(200px, 35%) minmax(200px, 40%) minmax(150px, 25%)',
      gridTemplateAreas: `"select search button"`,
    },
  }),
})

export const selectContainer = style({
  gridArea: 'select',
})

export const searchContainer = style({
  gridArea: 'search',
})

export const buttonContainer = style({
  gridArea: 'button',
})
