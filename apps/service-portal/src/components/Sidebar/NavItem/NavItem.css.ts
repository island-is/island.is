import { style, styleVariants, keyframes } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

const iconEaseIn = keyframes({
  from: {
    opacity: 0.8,
  },
  to: {
    opacity: 1,
  },
})

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
      },
    }),
  },
  inactive: {
    paddingLeft: theme.spacing[2],
    borderLeft: `4px solid ${theme.color.white}`,
    color: theme.color.blue600,
    ...themeUtils.responsiveStyle({
      md: {
        paddingLeft: theme.spacing[3],
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

export const navItemHover = styleVariants({
  hoverActive: {
    color: theme.color.blue400,
    borderLeft: `4px solid ${theme.color.blue400}`,
    textDecoration: 'none',
  },
  hoverInactive: {
    backgroundColor: theme.color.blue100,
    color: theme.color.blue400,
    borderLeft: `4px solid ${theme.color.blue100}`,
  },
  hoverCollapsed: {
    ...themeUtils.responsiveStyle({
      lg: {
        backgroundColor: theme.color.blue100,
        color: theme.color.blue400,
        borderRadius: '8px',
      },
    }),
  },
  none: {},
})
export const text = style({
  fontSize: 16,
  lineHeight: '26px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
})

export const iconWrapper = style({
  position: 'absolute',
  right: 0,
  paddingRight: theme.spacing[2],
  paddingTop: theme.spacing[1],
  cursor: 'pointer',
  color: theme.color.blue600,
  ':hover': {
    color: theme.color.blue400,
  },
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
    top: 6,
    height: theme.spacing[1],
    width: theme.spacing[1],
    borderRadius: '50%',
    backgroundColor: theme.color.red400,
  },
  inactive: {
    display: 'none',
  },
})

export const badgeCollapsed = style({
  left: 10,
})

export const lock = style({
  pointerEvents: 'none',
  marginRight: 4,
})

export const lockCollapsed = style({
  position: 'absolute',
  top: -5,
  right: -8,
})

export const subLock = style({
  marginRight: 5,
  pointerEvents: 'none',
})

export const subLockCollapsed = style({
  position: 'absolute',
  right: -6,
  height: 14,
  marginRight: 5,
  pointerEvents: 'none',
})

export const link = style({
  width: '100%',
  ':hover': {
    textDecoration: 'none',
  },
})

export const subLink = style({
  fontSize: 14,
  color: theme.color.blue600,
  ':hover': {
    color: theme.color.blue400,
  },
})

export const subLinkActive = style({
  fontSize: 14,
  color: theme.color.blue400,
  fontWeight: theme.typography.semiBold,
})

// TEST

const hoverDot = keyframes({
  '0%': {
    transform: 'translateX(0px)',
    fill: '#0044b3',
  },
  '50%': {
    transform: 'translateX(-24px)',
    fill: '#0061ff',
  },
  '100%': {
    transform: 'translateX(0px)',
    fill: '#0044b3',
  },
})

const hoverCard = keyframes({
  '0%': {
    transform: 'rotate(0deg) translate(60px, 140px)',
    fill: '#fff',
  },
  '50%': {
    transform: 'rotate(-18deg) translate(60px, 140px)',
    fill: '#0061ff',
  },
  '100%': {
    transform: 'rotate(0deg) translate(60px, 140px)',
    fill: '#fff',
  },
})

const hoverColor = keyframes({
  '0%': {
    transform: 'scale(1)',
    stroke: '#0044b3',
  },
  '50%': {
    transform: 'scale(0.96)',
    fill: '#0061ff',
  },
  '100%': {
    transform: 'scale(1)',
    fill: '#0044b3',
  },
})

export const testIconWrapper = style({})

export const testCard = style({
  fill: '#fff',
  width: 424,
  height: 288,
  transformOrigin: 'left',
  transform: 'rotate(0deg) translate(48px, 140px)',
  //transition: 'all 0.2s ease-out',
})

export const testCardHover = style({
  width: 424,
  height: 288,
  transformOrigin: 'left',
  fill: '#fff',
  transform: 'rotate(0deg) translate(48px, 140px)',
  //transition: 'all 0.2s ease-out',

  // transform: 'rotate(-18deg) translate(60px, 140px)',
  //fill: '#0061ff',
  animation: `${hoverCard} .45s cubic-bezier(0.4, 0, 0.2, 1)`,
})

export const testBack = style({
  fill: 'none',
  strokeWidth: 32,
  //transition: 'color 0.2s ease-in-out',
})

export const testFront = style({
  fill: '#fff',
  strokeWidth: 32,
  width: 416,
  height: 288,
  transform: 'translate(48px, 144px)',
  //transition: 'all 0.2s ease-in-out',
})

export const testFrontHover = style({
  fill: '#fff',
  strokeWidth: 32,
  width: 416,
  height: 288,
  transform: 'translate(48px, 144px)',
  // fill: '#fff',
  // strokeWidth: 32,
  // width: 416,
  // height: 288,
  // transform: 'translate(48px, 144px)',
  // transition: 'all 0.2s ease-in-out',
  // stroke: '#0061ff',
})

export const testDot = style({
  fill: '#0044b3',
  transform: 'translateX(0px)',
  // transition: 'all 0.2s ease-out',
})

export const testDotHover = style({
  fill: '#0061ff',
  //transform: 'translateX(-24px)',
  transform: 'translateX(0px)',
  animation: `${hoverDot} .45s cubic-bezier(0.4, 0, 0.2, 1)`,
})
export const testIcon = style({
  width: 24,
  height: 24,
  stroke: '#0044b3',
  strokeLinejoin: 'round',
})

export const testIconHover = style({
  width: 24,
  height: 24,
  stroke: '#0061ff',
  strokeLinejoin: 'round',
  animation: `${hoverColor} .45s cubic-bezier(0.4, 0, 0.2, 1)`,
})
