import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

const columnGap = theme.spacing[4]

export const columns = style({
  display: 'flex',
  flexGrow: 1,
  minWidth: 0,
  ...themeUtils.responsiveStyle({
    xs: { flexDirection: 'column', rowGap: theme.spacing[2] },
    md: { flexDirection: 'row', columnGap: columnGap * 2 },
  }),
})

export const column = style({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing[1],
  flex: '1 1 0',
  minWidth: 0,
  margin: 0,
})

export const columnDivided = style({
  ...themeUtils.responsiveStyle({
    xs: {
      borderTop: `1px solid ${theme.color.blue200}`,
      paddingTop: theme.spacing[2],
    },
    md: { borderTop: 'none', paddingTop: 0 },
  }),
})

export const item = style({
  position: 'relative',
  paddingTop: theme.spacing[1],
  paddingBottom: theme.spacing[1],
})

export const itemDivided = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.md}px)`]: {
      selectors: {
        '&::before': {
          content: '""',
          position: 'absolute',
          top: theme.spacing[1],
          bottom: theme.spacing[1],
          left: -columnGap,
          width: 1,
          backgroundColor: theme.color.blue200,
        },
      },
    },
  },
})

export const value = style({
  marginLeft: 0,
})

export const image = style({
  flexShrink: 0,
  display: 'none',
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      display: 'block',
      marginRight: theme.spacing[5],
    },
  },
})
