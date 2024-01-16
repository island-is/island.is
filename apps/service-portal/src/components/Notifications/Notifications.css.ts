import { spacing, theme, themeUtils } from '@island.is/island-ui/theme'
import { style, globalStyle } from '@vanilla-extract/css'
import { StyleWithSelectors } from '@vanilla-extract/css/dist/declarations/src/types'

export const navWrapper = style({
  paddingTop: theme.spacing[1],
})

export const container = style({
  top: theme.headerHeight.small,
  zIndex: theme.zIndex.belowHeader,
  maxHeight: `calc(100vh - ${theme.headerHeight.small}px)`,
  overflowY: 'auto',

  ...themeUtils.responsiveStyle({
    md: {
      maxHeight: 'unset',
      overflowY: 'unset',
      top: 'unset',
    },
  }),
})

const dropdownBase: StyleWithSelectors = {
  position: 'fixed',
  right: spacing[0],
  left: spacing[0],
  borderRadius: 'unset',
  maxHeight: `calc(100vh - ${theme.headerHeight.small}px)`,
}

const dropdownBaseMD: StyleWithSelectors = {
  top: spacing[3],
  width: 448,
  borderRadius: theme.border.radius.large,
  filter: 'drop-shadow(0px 4px 70px rgba(0, 97, 255, 0.1))',
}

export const dropdown = style({
  ...dropdownBase,
  overflow: 'auto',
  ...themeUtils.responsiveStyle({
    md: {
      ...dropdownBaseMD,
      left: 'auto',
      right: 'auto',
      top: spacing[2],
    },
    lg: {
      top: spacing[4],
    },
  }),
})

export const fullScreen = style({
  ...dropdownBase,
  ...themeUtils.responsiveStyle({
    md: {
      ...dropdownBaseMD,
      left: 'auto',
      right: spacing[3],
    },
  }),
})

export const wrapper = style({
  maxHeight: `calc(100vh - ${spacing[12]}px)`,
})

export const closeButton = style({
  justifyContent: 'center',
  alignItems: 'center',

  position: 'absolute',
  top: spacing[1],
  right: spacing[1],
  zIndex: 20,

  width: 44,
  height: 44,

  cursor: 'pointer',
  border: '1px solid transparent',
  backgroundColor: theme.color.white,

  borderRadius: '100%',
  transition: 'background-color 250ms, border-color 250ms',

  ':hover': {
    backgroundColor: theme.color.dark100,
  },

  ':focus': {
    outline: 'none',
    borderColor: theme.color.mint200,
  },
})

export const overviewIcon = style({
  height: 40,
  width: 40,
})

export const link = style({
  overflow: 'hidden',
})

globalStyle(`${link} > span`, {
  boxShadow: 'none',
})

// Line

export const lineWrapper = style({
  width: '100%',
})

export const line = style({
  paddingTop: theme.spacing.smallGutter * 3,
  paddingBottom: theme.spacing.smallGutter * 3,
  selectors: {
    '&:hover': {
      backgroundColor: theme.color.blue100,
    },
  },
})

export const unread = style({
  backgroundColor: theme.color.blueberry100,
})
