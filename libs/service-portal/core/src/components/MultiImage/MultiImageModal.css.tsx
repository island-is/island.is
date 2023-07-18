import { theme, themeUtils, white } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const modal = style({
  position: 'relative',
  margin: theme.spacing.smallGutter,
  borderRadius: theme.border.radius.large,
  overflow: 'auto',
  boxShadow: '0px 4px 70px rgba(0, 97, 255, 0.1)',
  ...themeUtils.responsiveStyle({
    md: {
      margin: `${theme.spacing['6']}px auto`,
      height: 515,
      width: 570,
    },
  }),
})

export const container = style({
  height: '100%',
  width: '100%',
  display: 'grid',
  gridTemplateRows: '80% 20%',
  backgroundColor: white,
  padding: theme.spacing[1],
})

export const mainImage = style({
  height: '90%',
})

export const arrows = style({
  alignSelf: 'center',
  color: theme.color.dark300,
})

export const imageNav = style({})

export const thumbnail = style({
  position: 'relative',
  height: theme.spacing[10],
  width: theme.spacing[10],
  borderRadius: theme.border.radius.large,
  borderColor: theme.border.color.blue200,
  opacity: 0.6,
})

export const selectedThumbnail = style({
  opacity: 1,
  borderColor: theme.border.color.blue400,
})
