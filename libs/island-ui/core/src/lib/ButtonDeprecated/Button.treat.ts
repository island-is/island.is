import { styleMap, style, globalStyle } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

const speed = '150ms'

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return result
    ? `${parseInt(result[1], 16)}, ` +
        `${parseInt(result[2], 16)}, ` +
        `${parseInt(result[3], 16)}`
    : null
}

export const button = style({
  display: 'inline-flex',
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: theme.border.radius.large,
  outline: 0,
  border: 0,
  cursor: 'pointer',
  fontFamily: 'IBM Plex Sans, sans-serif',
  fontStyle: 'normal',
  fontWeight: theme.typography.semiBold,
  transition: `color ${speed} ease, background-color ${speed} ease`,
  ':disabled': {
    cursor: 'not-allowed',
    pointerEvents: 'none',
  },
  ':focus': {
    color: theme.color.dark400,
    backgroundColor: theme.color.mint400,
  },
  ':hover': {
    textDecoration: 'none',
  },
  ':after': {
    content: "''",
    position: 'absolute',
    pointerEvents: 'none',
    borderStyle: 'solid',
    borderWidth: 4,
    borderColor: theme.color.mint400,
    borderRadius: theme.border.radius.large,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0,
    transition: `border-color ${speed} ease, opacity ${speed} ease`,
  },
})

export const noWrap = style({
  whiteSpace: 'nowrap',
})

const sizeMenuDesktop = {
  minHeight: 48,
  padding: '0 12px',
  fontSize: 14,
  lineHeight: 1.142857,
}

const sizeMenuMobile = {
  minHeight: 40,
  padding: '0 12px',
  fontSize: 12,
  lineHeight: 1.333333,
}

const sizeMediumDesktop = {
  fontSize: 18,
  lineHeight: 1.555555,
  minHeight: 64,
  padding: '0 24px',
}

const sizeLargeDesktop = {
  fontSize: 24,
  lineHeight: 1.416666,
  minHeight: 80,
  padding: '0 24px',
}

const sizeMediumMobile = {
  fontSize: 15,
  lineHeight: 2.75,
  minHeight: 64,
  padding: '0 24px',
}

const sizeLargeMobile = {
  fontSize: 20,
  lineHeight: 1.4,
  minHeight: 72,
  padding: '0 24px',
}

export const sizes = styleMap({
  small: {
    ...themeUtils.responsiveStyle({
      xs: sizeMediumMobile,
      md: sizeMediumDesktop,
    }),
  },
  medium: {
    ...themeUtils.responsiveStyle({
      xs: sizeMediumMobile,
      md: sizeMediumDesktop,
    }),
  },
  large: {
    ...themeUtils.responsiveStyle({
      xs: sizeLargeMobile,
      md: sizeLargeDesktop,
    }),
  },
})

export const width = styleMap({
  normal: {
    width: 'auto',
  },
  fixed: {
    maxWidth: 210,
    width: '100%',
  },
  fluid: {
    width: '100%',
  },
})

export const variants = styleMap({
  normal: {
    backgroundColor: theme.color.blue400,
    color: theme.color.white,
    ':disabled': {
      backgroundColor: theme.color.blue300,
    },
    ':hover': {
      color: theme.color.white,
      backgroundColor: theme.color.blueberry400,
    },
    ':active': {
      backgroundColor: theme.color.blueberry400,
    },
    selectors: {
      '&:focus:active': {
        color: theme.color.white,
      },
      '&:hover:active:after': {
        opacity: 1,
      },
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: theme.color.blue400,
    ':disabled': {
      color: theme.color.blue300,
    },
    ':after': {
      opacity: 1,
      borderWidth: 1,
      borderColor: theme.color.blue400,
      borderRadius: theme.border.radius.large,
    },
    ':hover': {
      color: theme.color.blueberry400,
    },
    ':focus': {
      color: theme.color.dark400,
    },
    ':active': {
      backgroundColor: 'transparent',
      color: theme.color.blue400,
    },
    selectors: {
      '&:disabled:after': {
        borderColor: theme.color.blue300,
      },
      '&:hover:after': {
        borderColor: theme.color.blueberry400,
      },
      '&:focus:after': {
        borderColor: theme.color.mint400,
      },
      '&:hover:active:after': {
        borderWidth: 4,
        opacity: 1,
      },
    },
  },
  redGhost: {
    backgroundColor: 'transparent',
    color: theme.color.red400,
    ':disabled': {
      color: theme.color.red300,
    },
    ':after': {
      opacity: 1,
      borderWidth: 1,
      borderColor: theme.color.red400,
      borderRadius: theme.border.radius.large,
    },
    ':hover': {
      color: theme.color.red600,
    },
    ':focus': {
      color: theme.color.white,
      backgroundColor: theme.color.red600,
    },
    ':active': {
      backgroundColor: 'transparent',
      color: theme.color.red600,
    },
    selectors: {
      '&:disabled:after': {
        borderColor: theme.color.red300,
      },
      '&:hover:after': {
        borderColor: theme.color.red600,
      },
      '&:focus:after': {
        borderColor: theme.color.red600,
      },
      '&:hover:active:after': {
        borderWidth: 4,
        opacity: 1,
      },
    },
  },
  text: {
    display: 'inline',
    backgroundColor: 'transparent',
    color: theme.color.blue400,
    borderRadius: 0,
    fontStyle: 'normal',
    padding: 0,
    fontWeight: theme.typography.semiBold,
    ':disabled': {
      color: theme.color.blue300,
    },
    ':after': {
      opacity: 1,
      borderWidth: 1,
      borderTop: 0,
      borderLeft: 0,
      borderRight: 0,
      borderColor: theme.color.blue400,
      borderRadius: 0,
    },
    ':hover': {
      color: theme.color.blueberry400,
    },
    selectors: {
      '&:disabled:after': {
        borderColor: theme.color.blue300,
      },
      [`&${sizes.small}`]: {
        minHeight: 24,
        fontSize: 14,
        lineHeight: 1.142857,
        padding: 0,
      },
      [`&${sizes.medium}`]: {
        minHeight: 36,
        fontSize: 18,
        lineHeight: 1.555555,
        padding: 0,
      },
      [`&${sizes.large}`]: {
        minHeight: 42,
        fontSize: 24,
        lineHeight: 1.416666,
        padding: 0,
      },
      '&:focus:hover': {
        color: theme.color.dark400,
      },
      '&:hover:after': {
        borderColor: theme.color.blueberry400,
      },
      '&:focus:active, &:active': {
        backgroundColor: theme.color.mint400,
        color: theme.color.blue400,
      },
      '&:focus:after': {
        borderColor: theme.color.dark400,
      },
      '&:focus:active:after, &:hover:active:after': {
        borderWidth: 1,
        borderColor: theme.color.blue400,
        opacity: 1,
      },
    },
  },
  menu: {
    backgroundColor: theme.color.transparent,
    borderStyle: 'solid',
    borderColor: theme.color.blue200,
    borderWidth: 1,
    borderRadius: theme.border.radius.large,
    transition: `border-color ${speed} ease`,
    ...themeUtils.responsiveStyle({
      xs: sizeMenuMobile,
      md: sizeMenuDesktop,
    }),
    ':after': {
      borderColor: theme.color.mint400,
      borderWidth: 3,
      opacity: 0,
      borderRadius: theme.border.radius.large,
      top: -3,
      left: -3,
      bottom: -3,
      right: -3,
    },
    ':disabled': {
      color: theme.color.dark300,
      opacity: 0.5,
    },
    ':hover': {
      borderColor: theme.color.blue400,
      backgroundColor: theme.color.transparent,
    },
    ':focus': {
      borderColor: theme.color.transparent,
      backgroundColor: theme.color.transparent,
    },
    selectors: {
      [`&:hover:focus`]: {
        borderColor: theme.color.transparent,
        backgroundColor: theme.color.transparent,
      },
      [`&:hover:after`]: {
        borderColor: theme.color.blue400,
      },
      [`&:focus:after`]: {
        borderColor: theme.color.mint400,
        opacity: 1,
      },
    },
  },
})

export const rounded = style({
  borderRadius: '50px',
  ':after': {
    borderRadius: '50px',
  },
})

export const white = style({
  backgroundColor: theme.color.transparent,
  borderColor: theme.color.white,
  color: theme.color.white,
  ':after': {
    borderColor: theme.color.white,
  },
  ':disabled': {
    color: theme.color.white,
  },
  ':hover': {
    color: theme.color.white,
    borderColor: theme.color.white,
    backgroundColor: theme.color.transparent,
  },
  ':focus': {
    color: theme.color.white,
    borderColor: theme.color.transparent,
    backgroundColor: theme.color.transparent,
  },
  selectors: {
    [`&:focus:hover`]: {
      borderColor: theme.color.transparent,
      backgroundColor: theme.color.transparent,
    },
    [`&:hover:after`]: {
      borderColor: theme.color.white,
    },
    [`&:focus:after`]: {
      borderColor: theme.color.mint400,
      opacity: 1,
    },
    [`&${variants.text}:focus`]: {
      backgroundColor: theme.color.mint400,
      color: theme.color.dark400,
    },
    [`&${variants.text}:focus:hover`]: {
      backgroundColor: theme.color.mint400,
      color: theme.color.dark400,
    },
    [`&${variants.text}:after`]: {
      borderColor: theme.color.white,
    },
    [`&${variants.text}:hover:after`]: {
      borderColor: theme.color.white,
    },
    [`&${variants.text}:focus:active`]: {
      backgroundColor: theme.color.mint400,
      color: theme.color.blue400,
    },
    [`&${variants.text}:active`]: {
      backgroundColor: theme.color.mint400,
      color: theme.color.blue400,
    },
    [`&${variants.text}:focus:after`]: {
      borderColor: theme.color.dark400,
    },
    [`&${variants.text}:focus:active:after`]: {
      borderWidth: 1,
      borderColor: theme.color.white,
      opacity: 1,
    },
    [`&${variants.text}:hover:active:after`]: {
      borderWidth: 1,
      borderColor: theme.color.white,
      opacity: 1,
    },
  },
})

globalStyle(`${button} path`, {
  transition: `fill ${speed} ease`,
})

// Normal icon colors
globalStyle(`${variants.normal} path`, {
  fill: theme.color.white,
})
globalStyle(`${variants.normal}:focus path`, {
  fill: theme.color.dark400,
})
globalStyle(`${variants.normal}:hover path`, {
  fill: theme.color.white,
})
globalStyle(`${variants.normal}:active path`, {
  fill: theme.color.white,
})
globalStyle(`${variants.normal}:active path`, {
  fill: theme.color.white,
})

// Ghost icon colors
globalStyle(`${variants.ghost} path`, {
  fill: theme.color.blue400,
})
globalStyle(`${variants.ghost}:hover path`, {
  fill: theme.color.blueberry400,
})
globalStyle(`${variants.ghost}:focus path`, {
  fill: theme.color.dark400,
})
globalStyle(`${variants.ghost}:active path`, {
  fill: theme.color.blue400,
})

// Text icon colors
globalStyle(`${white}${variants.text} path`, {
  fill: theme.color.white,
})
globalStyle(`${variants.text} path`, {
  fill: theme.color.blue400,
})
globalStyle(`${white}${variants.text}:hover path`, {
  fill: theme.color.white,
})
globalStyle(`${variants.text}:hover path`, {
  fill: theme.color.blueberry400,
})
globalStyle(
  `${white}${variants.text}:focus path, ${variants.text}:focus path`,
  {
    fill: theme.color.dark400,
  },
)
globalStyle(
  `${white}${variants.text}:active path, ${variants.text}:active path`,
  {
    fill: theme.color.blue400,
  },
)

// Menu icon colors
globalStyle(`${variants.menu} path`, {
  fill: theme.color.blue400,
})
globalStyle(`${variants.menu}:hover path`, {
  fill: theme.color.blue400,
})
globalStyle(`${variants.menu}:focus path`, {
  fill: theme.color.blue400,
})
globalStyle(`${variants.menu}:active path`, {
  fill: theme.color.blue400,
})

// White/transparent icon colors
globalStyle(`${white} path`, {
  fill: theme.color.white,
})
globalStyle(`${white}:hover path`, {
  fill: theme.color.white,
})
globalStyle(`${white}:focus path`, {
  fill: theme.color.white,
})
globalStyle(`${white}:active path`, {
  fill: theme.color.white,
})

export const leftSpacer = style({
  ...themeUtils.responsiveStyle({
    xs: {
      width: 24,
    },
    md: {
      width: 32,
    },
  }),
})

export const leftContentContainer = style({
  backgroundColor: theme.color.blue100,
  borderTopLeftRadius: theme.border.radius.large,
  borderBottomLeftRadius: theme.border.radius.large,
  ...themeUtils.responsiveStyle({
    xs: {
      width: 40,
    },
    md: {
      width: 48,
    },
  }),
  selectors: {
    [`${white} &`]: {
      backgroundColor: `rgba(${hexToRgb(theme.color.dark400)}, 0.1)`,
    },
  },
})

export const leftContent = style({
  height: 32,
  width: 32,
})

export const image = style({
  display: 'inline-block',
  width: '100%',
  height: '100%',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
})
