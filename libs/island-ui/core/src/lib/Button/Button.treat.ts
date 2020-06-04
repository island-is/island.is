import { styleMap, style, globalStyle } from 'treat'
import { theme, themeUtils } from '../../theme'

export const button = style({
  display: 'inline-flex',
  position: 'relative',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '10px',
  outline: 0,
  border: 0,
  cursor: 'pointer',
  fontFamily: 'IBM Plex Sans, sans-serif',
  fontStyle: 'normal',
  fontWeight: theme.typography.semiBold,
  transition: 'color 150ms ease, background-color 150ms ease',
  ':disabled': {
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
    borderWidth: '4px',
    borderColor: theme.color.mint400,
    borderRadius: '10px',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    opacity: 0,
    transition: 'opacity 150ms ease',
  },
})

const sizeMenuDesktop = {
  height: '48px',
  padding: '0 12px',
  fontSize: '14px',
  lineHeight: '16px',
}

const sizeMenuMobile = {
  height: '40px',
  padding: '0 12px',
  fontSize: '12px',
  lineHeight: '16px',
}

const sizeMediumDesktop = {
  fontSize: '18px',
  lineHeight: '28px',
  height: '64px',
  padding: '0 24px',
}

const sizeLargeDesktop = {
  fontSize: '24px',
  lineHeight: '34px',
  height: '80px',
  padding: '0 24px',
}

const sizeMediumMobile = {
  fontSize: '15px',
  lineHeight: '20px',
  height: '64px',
  padding: '0 24px',
}

const sizeLargeMobile = {
  fontSize: '20px',
  lineHeight: '28px',
  height: '72px',
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
      borderWidth: '1px',
      borderColor: theme.color.blue400,
      borderRadius: '10px',
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
        borderWidth: '4px',
        opacity: 1,
      },
    },
  },
  text: {
    backgroundColor: 'transparent',
    color: theme.color.blue400,
    borderRadius: 0,
    fontStyle: 'normal',
    padding: '0',
    fontWeight: theme.typography.semiBold,
    ':disabled': {
      color: theme.color.blue300,
    },
    ':after': {
      opacity: 1,
      borderWidth: '1px',
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
        height: '24px',
        fontSize: '14px',
        lineHeight: '16px',
        padding: '0',
      },
      [`&${sizes.medium}`]: {
        height: '36px',
        fontSize: '18px',
        lineHeight: '28px',
        padding: '0',
      },
      [`&${sizes.large}`]: {
        height: '42px',
        fontSize: '24px',
        lineHeight: '34px',
        padding: '0',
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
        borderWidth: '1px',
        borderColor: theme.color.blue400,
        opacity: 1,
      },
    },
  },
  menu: {
    ...themeUtils.responsiveStyle({
      xs: sizeMenuMobile,
      md: sizeMenuDesktop,
    }),
    ':after': {
      borderColor: theme.color.blue200,
      borderWidth: 1,
      opacity: 1,
      borderRadius: '10px',
    },
  },
})

globalStyle(`${button} path`, {
  transition: 'fill 150ms ease',
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
  fill: theme.color.blueberry400,
})
globalStyle(`${variants.menu}:focus path`, {
  fill: theme.color.dark400,
})
globalStyle(`${variants.menu}:active path`, {
  fill: theme.color.blue400,
})
