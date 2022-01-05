import { style, styleVariants } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import { NonceProvider } from 'react-select'

export const dotState = styleVariants({
  active: {},
  inactive: {},
})

export const navItem = style({})

export const navItemActive = styleVariants({
  active: {
    paddingLeft: theme.spacing[2],
    backgroundColor: theme.color.blue100,
    borderLeft: `4px solid ${theme.color.blue400}`,
    color: theme.color.blue400,
    ...themeUtils.responsiveStyle({
      md: {
        paddingLeft: theme.spacing[3],
        ':hover': {
          color: theme.color.blue400,
          borderColor: theme.color.blue100,
          textDecoration: 'none',
        },
      },
    }),
  },
  inactive: {
    paddingLeft: theme.spacing[2],
    marginLeft: 4,
    color: theme.color.blue600,
    ...themeUtils.responsiveStyle({
      md: {
        paddingLeft: theme.spacing[3],
        ':hover': {
          backgroundColor: theme.color.blue100,
          color: theme.color.blue400,
          border: 'unset',
          marginLeft: 4,
        },
      },
    }),
  },
  activeCollapsed: {
    backgroundColor: theme.color.blue100,
    border: `1px solid ${theme.color.blue100}`,
    borderRadius: '8px',
    ...themeUtils.responsiveStyle({
      md: {
        color: theme.color.blue400,
        border: 'unset',
        paddingLeft: theme.spacing[1],
      },
    }),
  },
  inactiveCollapsed: {
    ...themeUtils.responsiveStyle({
      md: {
        color: theme.color.blue600,
        paddingLeft: theme.spacing[1],
      },
    }),
  },
})

export const text = style({
  fontSize: 16,
  lineHeight: '26px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
})

export const icon = style({
  pointerEvents: 'none',
  height: '26px',
  ':hover': {
    fill: theme.color.blue400,
  },
})

export const dot = style({
  left: -35,
  width: theme.spacing['1'],
  height: theme.spacing['1'],
  transition: 'opacity 250ms',
  selectors: {
    [`${navItem}:hover &:not(${dotState.active})`]: {
      opacity: 0.2,
    },
    [`${dotState.active} &`]: {
      opacity: 1,
    },
    [`&:not(${dotState.active})`]: {
      opacity: 0,
    },
  },
})

export const badge = styleVariants({
  active: {
    position: 'absolute',
    top: 9,
    height: theme.spacing[1],
    width: theme.spacing[1],
    borderRadius: '50%',
    backgroundColor: theme.color.red400,
  },
  inactive: {
    display: 'none',
  },
})

export const lock = style({
  pointerEvents: 'none',
  marginRight: 4,
})

export const subLock = style({
  pointerEvents: 'none',
  marginRight: 5,
})

export const link = style({
  ':hover': {
    textDecoration: 'none',
  },
})

export const subLink = style({
  fontSize: 14,
  color: theme.color.blue600,
  ':hover': {
    textDecoration: 'none',
    color: theme.color.blue400,
    fontWeight: theme.typography.semiBold,
  },
})

export const subLinkActive = style({
  fontSize: 14,
  color: theme.color.blue400,
  fontWeight: theme.typography.semiBold,
  ':hover': {
    textDecoration: 'none',
  },
})
