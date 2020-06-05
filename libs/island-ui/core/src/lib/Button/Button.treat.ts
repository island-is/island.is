import { styleMap, style, globalStyle } from 'treat'
import { theme, themeUtils } from '../../theme'

const speed = '150ms'

export const button = style({
  display: 'inline-flex',
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10,
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
    borderRadius: 10,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0,
    transition: `border-color ${speed} ease, opacity ${speed} ease`,
  },
})

const sizeMenuDesktop = {
  height: 48,
  padding: '0 12px',
  fontSize: 14,
  lineHeight: 1.142857,
}

const sizeMenuMobile = {
  height: 40,
  padding: '0 12px',
  fontSize: 12,
  lineHeight: 1.333333,
}

const sizeMediumDesktop = {
  fontSize: 18,
  lineHeight: 1.555555,
  height: 64,
  padding: '0 24px',
}

const sizeLargeDesktop = {
  fontSize: 24,
  lineHeight: 1.416666,
  height: 80,
  padding: '0 24px',
}

const sizeMediumMobile = {
  fontSize: 15,
  lineHeight: 2.75,
  height: 64,
  padding: '0 24px',
}

const sizeLargeMobile = {
  fontSize: 20,
  lineHeight: 1.4,
  height: 72,
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
      borderRadius: 10,
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
  text: {
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
        height: 24,
        fontSize: 14,
        lineHeight: 1.142857,
        padding: 0,
      },
      [`&${sizes.medium}`]: {
        height: 36,
        fontSize: 18,
        lineHeight: 1.555555,
        padding: 0,
      },
      [`&${sizes.large}`]: {
        height: 42,
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
    transition: `border-color ${speed} ease`,
    ...themeUtils.responsiveStyle({
      xs: sizeMenuMobile,
      md: sizeMenuDesktop,
    }),
    ':after': {
      borderColor: theme.color.mint400,
      borderWidth: 3,
      opacity: 0,
      borderRadius: 10,
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
globalStyle(`${variants.text} path`, {
  fill: theme.color.blue400,
})
globalStyle(`${variants.text}:hover path`, {
  fill: theme.color.blueberry400,
})
globalStyle(`${variants.text}:focus path`, {
  fill: theme.color.dark400,
})
globalStyle(`${variants.text}:active path`, {
  fill: theme.color.blue400,
})

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
  borderTopLeftRadius: 9,
  borderBottomLeftRadius: 9,
  ...themeUtils.responsiveStyle({
    xs: {
      width: 40,
    },
    md: {
      width: 48,
    },
  }),
})

export const leftContent = style({
  height: 32,
  width: 32,
})

export const image = style({
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
})
