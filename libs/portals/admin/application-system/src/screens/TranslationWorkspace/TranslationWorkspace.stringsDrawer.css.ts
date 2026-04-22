import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

/**
 * Viewport-aware drawer width: narrower on small screens so the preview stays
 * readable, widening with breakpoints (overrides default Drawer panel widths).
 */
export const stringsDrawerPanel = style({
  width: 'min(64vw, 300px)',
  maxWidth: 'calc(100vw - 16px)',
  minWidth: '240px',
  ...themeUtils.responsiveStyle({
    sm: {
      width: 'min(58vw, 360px)',
    },
    md: {
      width: 'min(48vw, 420px)',
    },
    lg: {
      width: 'min(42vw, 500px)',
    },
    xl: {
      width: 'min(36vw, 600px)',
    },
  }),
})
