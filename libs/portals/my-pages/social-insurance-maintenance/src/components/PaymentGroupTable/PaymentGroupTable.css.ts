import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const nestedLabelColumnCell = style({
  borderRight: `1px solid ${theme.border.color.blue200} `,
  boxShadow: `4px 0px 8px -2px ${theme.border.color.blue200}`,
  left: 0,
  overflow: 'hidden',
  position: 'sticky',
  zIndex: theme.zIndex.above,
})

export const rowLabelColumnCell = style([
  nestedLabelColumnCell,
  {
    paddingLeft: theme.spacing[2],
    paddingRight: 0,

    ...themeUtils.responsiveStyle({
      lg: {
        paddingRight: theme.spacing[0],
        paddingLeft: theme.spacing[1],
      },
    }),
  },
])

export const rowLabelColumnCellBox = style({
  width: 'auto',
  ...themeUtils.responsiveStyle({
    lg: {
      width: '246px',
    },
  }),
})

export const hidden = style({
  visibility: 'hidden',
  margin: 0,
  padding: 0,
  border: 'none',
})

export const noWrap = style({
  whiteSpace: 'nowrap',
})

export const expandedColumnCell = style({
  borderWidth: 0,
})

export const reset = style({
  paddingRight: 0,
  paddingLeft: 0,
  paddingTop: 0,
  paddingBottom: 0,
})

export const nestedCell = style({
  height: '48px',
  display: 'flex',
  alignItems: 'center',
})

export const lastColumnCell = style({
  ...themeUtils.responsiveStyle({
    lg: {
      position: 'sticky',
      borderLeft: `1px solid ${theme.border.color.blue200} `,
      boxShadow: `-4px 0px 8px -2px ${theme.border.color.blue200}`,
      right: 0,
      overflow: 'hidden',
      zIndex: theme.zIndex.above,
    },
  }),
})

export const line = style({
  borderLeft: `2px solid ${theme.color.blue400}`,
  width: 0,
  height: 'calc(100% + 1px)',
  left: 0,
  top: 0,
  zIndex: theme.zIndex.above,
  position: 'absolute',
})

export const loader = style({
  minHeight: 24,
  minWidth: 24,
})
