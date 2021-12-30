import { style, styleVariants } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const dotState = styleVariants({
  active: {},
  inactive: {},
})

export const navItem = style({})

export const navItemActive = styleVariants({
  active: {
    backgroundColor: theme.color.white,
    border: 'unset',
    borderLeft: `4px solid ${theme.color.blue600}`,
    borderRadius: 'unset',
    marginTop: 1,
    marginBottom: 1,
    paddingLeft: 44,
    maxWidth: 280,
    ...themeUtils.responsiveStyle({
      lg: {
        backgroundColor: theme.color.blue200,
        border: `1px solid ${theme.color.blue200}`,
        borderTopLeftRadius: '8px',
        borderBottomLeftRadius: '8px',
        paddingLeft: 24,
        maxWidth: 'unset',
      },
    }),
  },
  inactive: {
    backgroundColor: theme.color.white,
    border: `1px solid ${theme.color.white}`,
    maxWidth: 280,
    paddingLeft: 48,
    ...themeUtils.responsiveStyle({
      lg: {
        paddingLeft: 24,
        backgroundColor: theme.color.blue100,
        border: `1px solid ${theme.color.blue100}`,
        maxWidth: 'unset',
      },
    }),
  },
  activeCollapsed: {
    backgroundColor: theme.color.blue200,
    border: `1px solid ${theme.color.blue200}`,
    borderRadius: '8px',
    ...themeUtils.responsiveStyle({
      lg: {
        paddingLeft: theme.spacing[1],
      },
    }),
  },
  inactiveCollapsed: {
    ...themeUtils.responsiveStyle({
      lg: {
        paddingLeft: theme.spacing[1],
        border: `1px solid ${theme.color.blue100}`,
      },
    }),
  },
})

export const text = style({
  fontSize: 16,
  lineHeight: '26px',
  color: theme.color.blue600,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
})

export const icon = style({
  pointerEvents: 'none',
  height: '26px',
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
