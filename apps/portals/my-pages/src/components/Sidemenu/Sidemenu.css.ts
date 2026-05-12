import { spacing, theme, themeUtils } from '@island.is/island-ui/theme'
import {
  globalStyle,
  keyframes,
  style,
  styleVariants,
} from '@vanilla-extract/css'
import { StyleWithSelectors } from '@vanilla-extract/css/dist/declarations/src/types'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const wrapperAnimation = keyframes({
  '0%': {
    transform: 'scale(1.05)',
    opacity: 0,
  },
  '100%': {
    transform: 'scale(1)',
    opacity: 1,
  },
})

export const navWrapper = style({
  display: 'grid',
  paddingBottom: theme.spacing[3],
  paddingTop: theme.spacing[3],
  gap: theme.spacing[1],
  ...themeUtils.responsiveStyle({
    md: {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    sm: {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    xs: {
      gridTemplateColumns: 'repeat(2, 1fr)',
      paddingBottom: theme.spacing[2],
      paddingTop: theme.spacing[2],
    },
  }),
})

export const link = style({
  display: 'block',
  height: '100%',
  paddingBottom: theme.spacing['1'],
})

export const categories = style({
  flexGrow: 2,
})

export const itemBlock = style({
  height: 88,
  maxHeight: 88,
  transition: 'border-color 200ms',
})

const iconBase: StyleWithSelectors = {
  width: 30,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export const icon = style({
  ...iconBase,
  marginBottom: theme.spacing[1],
})

export const badge = styleVariants({
  active: {
    position: 'absolute',
    top: 6,
    left: -2,
    height: theme.spacing[1],
    width: theme.spacing[1],
    borderRadius: '50%',
    backgroundColor: theme.color.red400,
    ...themeUtils.responsiveStyle({
      md: {
        left: -2,
      },
    }),
  },
  inactive: {
    display: 'none',
  },
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
  height: `calc(100vh - ${theme.headerHeight.small}px)`,
  maxHeight: `calc(100vh - ${theme.headerHeight.small}px)`,
}

const dropdownBaseMD: StyleWithSelectors = {
  top: spacing[3],
  width: 448,
  borderRadius: theme.border.radius.large,
  filter: 'drop-shadow(0px 4px 70px rgba(0, 97, 255, 0.1))',
  height: 'auto',
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
    backgroundColor: theme.color.blue100,
    color: theme.color.blue400,
  },

  ':focus': {
    outline: 'none',
    borderColor: theme.color.mint200,
  },
})

globalStyle(`${closeButton}:hover > svg`, {
  color: theme.color.blue400,
})

export const itemLink = style({
  width: '100%',
  ':hover': {
    textDecoration: 'none',
  },
})

export const itemContainer = style({
  transition: 'max-height 200ms ease-out',
  ':hover': {
    cursor: 'pointer',
  },
})

export const item = style({
  background: theme.color.blue100,
})

export const itemText = style({
  fontSize: 14,
  textAlign: 'center',
})

export const overviewIcon = style({
  height: 40,
  width: 40,
})
