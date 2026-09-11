import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const footer = style({
  zIndex: 1,
  backgroundColor: theme.color.overlayDefault,
})

export const floatingShadow = style({
  boxShadow: '0px 8px 16px 0px #00003C29',
})

export const grid = style({
  display: 'grid',
  gridTemplateColumns: '1fr auto',
  alignItems: 'start',
  paddingTop: theme.spacing[1],
  paddingBottom: theme.spacing[1],
  paddingLeft: theme.spacing[2],
  paddingRight: theme.spacing[2],
  ...themeUtils.responsiveStyle({
    md: {
      gridTemplateColumns:
        'minmax(var(--sticky-footer-label-min-width, 0px), auto) auto',
      justifyContent: 'start',
      paddingLeft: `var(--sticky-footer-label-indent, ${theme.spacing[2]}px)`,
    },
  }),
})

export const cell = style({
  paddingTop: theme.spacing[1],
  paddingBottom: theme.spacing[1],
  paddingLeft: theme.spacing[2],
  paddingRight: theme.spacing[2],
})

export const labelCell = style({
  minWidth: 0,
})

export const valueCell = style({
  whiteSpace: 'nowrap',
})
