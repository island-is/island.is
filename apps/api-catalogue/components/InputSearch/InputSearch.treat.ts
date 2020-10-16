import { style, styleMap } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const wrapper = style({
  display: 'inline-block',
  position: 'relative',
  width: '100%',
  ':after': {
    content: '""',
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
    pointerEvents: 'none',
    borderRadius: 6,
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: theme.color.mint400,
    opacity: 0,
  },
})

export const input = style({
  position: 'relative',
  width: '100%',
  height: 48,
  borderRadius: 5,
  background: theme.color.white,
  fontWeight: theme.typography.light,
  borderColor: theme.color.blue200,
  borderWidth: 1,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  padding: '16px 96px 16px 16px',
  borderStyle: 'solid',
  outline: 0,
  transition: 'border-color 150ms ease',
  ':hover': {
    borderColor: theme.color.blue400,
  },
  selectors: {
    [`&:focus:hover`]: {
      borderColor: theme.color.transparent,
    },
  },
  borderTopColor: 'transparent',
  borderLeftColor: 'transparent',
  borderRightColor: 'transparent',
})

export const loadingIcon = style({
  position: 'absolute',
  lineHeight: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  outline: 0,
  right: 8,
})

export const icon = style({
  position: 'absolute',
  lineHeight: 0,
  top: '50%',
  right: 26,
  transform: 'translateY(-50%)',
  outline: 0,
  '::before': {
    zIndex: -1,
    content: '""',
    borderRadius: 5,
    position: 'absolute',
    cursor: 'pointer',
    opacity: 0,
    backgroundColor: theme.color.white,
    borderColor: theme.color.blue200,
    borderStyle: 'solid',
    borderWidth: 1,
    transition: `opacity 150ms ease`,
  },
  selectors: {
    '&:focus::before': {
      borderColor: theme.color.blue400,
      borderWidth: 1,
      borderStyle: 'solid',
    },
  },
})

export const colored = style({
  backgroundColor: theme.color.blue100,
})

export const sizes = styleMap({
  medium: {
    fontSize: 15,
    lineHeight: 1.466666,
    ...themeUtils.responsiveStyle({
      md: {
        fontSize: 18,
        lineHeight: 1.416666,
      },
    }),
  },
  large: {
    fontSize: 20,
    lineHeight: 1.4,
    ...themeUtils.responsiveStyle({
      md: {
        lineHeight: 1.416666,
        fontSize: 24,
      },
    }),
  },
})

export const focused = style({
  ':after': {
    opacity: 1,
  },
})


const spinOrg = {
  lineHeight: 0,
  '@keyframes': {
    from: {
      transform: 'rotate(0deg)',
    },
    to: {
      transform: 'rotate(359deg)',
    },
  },
  animationTimingFunction: 'linear',
  animationIterationCount: 'infinite',
  animationDuration: '1.5s',
}

export const spin = style(spinOrg)

export const search = style({
  width:20,
  color:theme.color.blue400
  
})

export const loading = style({
  width:24,
  color:theme.color.blue400,
  ...spinOrg
  
})