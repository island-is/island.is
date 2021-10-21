import { style, styleMap, globalStyle } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'
import covidColors from '../UI/colors'

export const wrapper = style({
  position: 'relative',
  paddingTop: 24,
  marginLeft: -10,
  ...themeUtils.responsiveStyle({
    md: {
      paddingTop: 77,
      marginLeft: 0,
    },
  }),
})

export const item = style({
  display: 'flex',
  minWidth: '100%',
  paddingRight: 24,
  flexFlow: 'column',
})

export const variants = styleMap({
  blue: {},
  green: {},
})

export const arrowButton = style({
  display: 'inline-flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxSizing: 'border-box',
  width: 40,
  height: 40,
  backgroundColor: covidColors.green400,
  borderRadius: '50%',
  outline: 0,
  opacity: 1,
  transition: `all 300ms ease`,
  selectors: {
    [`${variants.blue} &`]: {
      backgroundColor: covidColors.blue400,
    },
    [`${variants.green} &`]: {
      backgroundColor: covidColors.green400,
    },
  },
})

export const arrowButtonDisabled = style({
  pointerEvents: 'none',
  opacity: 0.25,
  transition: `all 150ms ease`,
})

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
  backgroundColor: covidColors.blue400,
  selectors: {
    [`${variants.blue} &`]: {
      backgroundColor: covidColors.blue400,
    },
    [`${variants.green} &`]: {
      backgroundColor: covidColors.green400,
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
})
