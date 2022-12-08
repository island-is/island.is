import { style } from '@vanilla-extract/css'
import { themeUtils, theme } from '@island.is/island-ui/theme'

export const container = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(100px, 65%) minmax(115px, 35%)',
  gridTemplateAreas: `"select button" "search search"`,
  gridTemplateRows: '1fr',
  alignItems: 'end',
  gridColumnGap: theme.spacing[2],
  gridRowGap: theme.spacing[2],
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateColumns:
        'minmax(200px, 35%) minmax(200px, auto) minmax(150px, 172px)',
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
