import { theme, themeUtils, white } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const modal = style({
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '60%',
  maxHeight: `calc(100% - ${theme.spacing['6']}px)`,
  borderRadius: theme.border.radius.large,
  boxShadow: '0px 4px 70px rgba(0, 97, 255, 0.1)',

  ...themeUtils.responsiveStyle({
    lg: {
      maxWidth: '60%',
    },
  }),
})

export const main = style({
  gridArea: 'main',
})

export const closeButton = style({
  gridArea: 'exit',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export const rightCaret = style({
  gridArea: 'right',
})

export const leftCaret = style({
  gridArea: 'left',
})

export const carets = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
})

export const swiper = style({
  gridArea: 'swiper',
})

export const counter = style({
  gridArea: 'counter',
})

export const container = style({
  height: '100%',
  width: '100%',
  display: 'grid',
  borderRadius: theme.border.radius.large,
  gridTemplateRows: `${theme.spacing[8]}px 5fr ${theme.spacing[2]}px 1fr`,
  gridTemplateColumns: `${theme.spacing[10]}px 1fr ${theme.spacing[10]}px`,
  gridTemplateAreas:
    '". . exit""left main right" ". counter ." " swiper swiper swiper"',
  rowGap: '5px',
  backgroundColor: white,
})
