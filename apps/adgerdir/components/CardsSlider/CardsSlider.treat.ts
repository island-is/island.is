import { style, styleMap, globalStyle } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const wrapper = style({
  position: 'relative',
  paddingTop: 77,
})

export const item = style({
  display: 'flex',
  paddingRight: 24,
  flexFlow: 'column',
})

export const variants = styleMap({
  blue: {},
  red: {},
  purple: {},
})

export const arrowButton = style({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing: 'border-box',
  width: 40,
  height: 40,
  backgroundColor: theme.color.purple400,
  borderRadius: '50%',
  outline: 0,
  transition: `all 150ms ease`,
  selectors: {
    [`${variants.blue} &`]: {
      backgroundColor: theme.color.blue400,
    },
    [`${variants.red} &`]: {
      backgroundColor: theme.color.red400,
    },
    [`${variants.purple} &`]: {
      backgroundColor: theme.color.purple400,
    },
  },
})

export const arrowButtonDisabled = style({})

export const controls = style({
  position: 'absolute',
  top: -20,
  right: -20,
})

export const dotsContainer = style({
  position: 'absolute',
  lineHeight: 0,
  top: -4,
  left: 0,
})

export const dot = style({
  position: 'relative',
  width: 8,
  height: 8,
  borderRadius: '50%',
  marginRight: 16,
  outline: 0,
  backgroundColor: theme.color.blue400,
  selectors: {
    [`${variants.blue} &`]: {
      backgroundColor: theme.color.blue400,
    },
    [`${variants.red} &`]: {
      backgroundColor: theme.color.red400,
    },
    [`${variants.purple} &`]: {
      backgroundColor: theme.color.purple400,
    },
  },
  ':after': {
    content: '""',
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
  },
})

globalStyle(`${wrapper} .alice-carousel__wrapper`, {
  overflow: 'visible',
  ...themeUtils.responsiveStyle({
    md: {},
  }),
})
