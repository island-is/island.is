import { style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

const SPACING = theme.spacing[3]

export const container = style({
  display: 'flex',
  width: '100%',
  flexWrap: 'wrap',
  flexDirection: 'row',
  ...themeUtils.responsiveStyle({
    md: {
      flexWrap: 'nowrap',
    },
  }),
})

export const logo = style({
  display: 'inline-block',
  width: '50%',
  order: 1,
  ...themeUtils.responsiveStyle({
    md: {
      width: 'auto',
    },
  }),
})

export const content = style({
  display: 'inline-flex',
  position: 'relative',
  whiteSpace: 'nowrap',
  flexWrap: 'nowrap',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  overflow: 'hidden',
  order: 3,
  marginTop: theme.spacing[2],
  marginLeft: -SPACING,
  marginRight: -SPACING,
  paddingBottom: 1,
  ...themeUtils.responsiveStyle({
    md: {
      position: 'initial',
      order: 2,
      marginTop: 0,
      marginLeft: 0,
      marginRight: SPACING,
    },
  }),
})

export const truncate = style({
  display: 'inline-block',
  width: '100%',
  overflowX: 'auto',
  scrollbarWidth: 'none',
  whiteSpace: 'nowrap',
  textOverflow: 'initial',
  paddingLeft: SPACING,
  ...themeUtils.responsiveStyle({
    md: {
      overflowX: 'hidden',
      textOverflow: 'ellipsis',
      paddingLeft: 0,
    },
  }),
  selectors: {
    [`&::-webkit-scrollbar`]: {
      display: 'none',
    },
  },
})

export const link = style({
  lineHeight: 1.5,
  fontWeight: theme.typography.regular,
  fontSize: 12,
  paddingRight: SPACING,
  ...themeUtils.responsiveStyle({
    md: {
      fontSize: 14,
    },
  }),
  ':hover': {
    textDecoration: 'underline',
  },
})

export const button = style({
  display: 'none',
  width: '50%',
  textAlign: 'right',
  order: 2,
  ...themeUtils.responsiveStyle({
    md: {
      order: 3,
      width: 'auto',
    },
  }),
})

export const buttonVisible = style({
  display: 'inline-block',
})
