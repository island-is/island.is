import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const line = style({
  borderLeft: `2px solid ${theme.color.blue400}`,
  width: 0,
  height: 'calc(100% + 1px)',
  left: 0,
  top: 0,
  zIndex: 10,
  position: 'absolute',
})

export const loader = style({
  minHeight: 24,
  minWidth: 24,
})

export const firstColumn = style({
  borderRight: `1px solid ${theme.border.color.blue200} `,
  boxShadow: `4px 0px 8px -2px ${theme.border.color.blue200}`,
  left: theme.spacing[9],
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  zIndex: theme.zIndex.above,
  width: '140px',
  ...themeUtils.responsiveStyle({
    md: {
      width: theme.spacing[23],
    },
  }),
})

export const lastColumn = style({
  borderLeft: `1px solid ${theme.border.color.blue200}`,
  boxShadow: `-4px 0px 8px -2px ${theme.border.color.blue200}`,
  right: 0,
  position: 'initial',
  ...themeUtils.responsiveStyle({
    md: {
      position: 'sticky',
    },
  }),
})
