import { theme, themeUtils } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

const gridContainerBase = {
  display: 'grid',
  gap: theme.spacing[2],
  ...themeUtils.responsiveStyle({
    md: {
      gap: theme.spacing[3],
    },
  }),
  justifyContent: 'stretch',
}

export const cardBase = style({
  minWidth: '320px',
})

export const infoCardHeader = style({
  minHeight: '48px',
})

export const gridContainerMaxTwoColumns = style({
  ...gridContainerBase,
  gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
})

export const gridContainerMaxThreeColumn = style({
  ...gridContainerBase,
  gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
})

export const gridContainerMaxOneColumn = style({
  ...gridContainerBase,
export const gridContainerMaxOneColumn = style({
  ...gridContainerBase,
  gridTemplateColumns: 'minmax(320px, 1fr)',
})
})

export const iconBox = style({})

globalStyle(`${iconBox} > svg`, {
  minWidth: 24,
})
