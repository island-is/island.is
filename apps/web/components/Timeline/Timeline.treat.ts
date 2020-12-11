import { style, styleMap } from 'treat'
import { themeUtils, theme } from '@island.is/island-ui/theme'

export const container = style({
  position: 'relative',
  display: 'flex',
})

export const innerContainer = style({
  position: 'relative',
  whiteSpace: 'nowrap',
  display: 'inline-flex',
  height: 'auto',
  flexDirection: 'row',
  transition: `transform 300ms ease`,
  ':before': {
    content: '""',
    position: 'absolute',
    opacity: 0.5,
    width: '100%',
    height: 8,
    left: 0,
    right: 0,
    top: 'initial',
    bottom: 56,
    borderRadius: 10,
    background: `linear-gradient(-90.09deg, #0161FD 15.89%, #3F46D2 33.21%, #812EA4 51.23%, #C21578 69.24%, #FD0050 85.18%)`,
  },
  ...themeUtils.responsiveStyle({
    lg: {
      minWidth: '100%',
      flexDirection: 'column',
      ':before': {
        background: `linear-gradient(359.09deg, #0161FD 15.89%, #3F46D2 33.21%, #812EA4 51.23%, #C21578 69.24%, #FD0050 85.18%)`,
        width: 8,
        height: 'auto',
        left: 96,
        top: 0,
        bottom: 0,
      },
    },
  }),
})

export const frame = style({
  position: 'relative',
  display: 'flex',
  padding: '0',
  minHeight: '100%',
  minWidth: '100%',
  maxHeight: 600,
  overflowX: 'scroll',
  transition: `transform 500ms ease`,
  ...themeUtils.responsiveStyle({
    lg: {
      display: 'inline-block',
      maxHeight: 1000,
      width: '100%',
      overflow: 'hidden',
    },
  }),
})

export const month = style({
  fontSize: 14,
  lineHeight: 1.142857,
  fontWeight: theme.typography.semiBold,
})

export const year = style({
  display: 'inline-block',
  fontSize: 24,
  margin: '0 40px',
  lineHeight: 1.416666,
  fontWeight: theme.typography.semiBold,
  ...themeUtils.responsiveStyle({
    lg: {
      marginLeft: 0,
      marginRight: 0,
      marginTop: 40,
    },
  }),
})

export const eventWrapper = style({
  position: 'relative',
  outline: 0,
  display: 'inline-flex',
  width: 'auto',
  minHeight: 300,
  marginRight: 40,
  marginBottom: 0,
  justifyContent: 'flex-end',
  alignItems: 'center',
  flexDirection: 'column',
  ':last-child': {
    marginRight: 0,
  },
  ...themeUtils.responsiveStyle({
    lg: {
      flexDirection: 'row-reverse',
      maxWidth: '100px',
      minHeight: 'auto',
      marginRight: 0,
      marginBottom: 40,
      ':last-child': {
        marginBottom: 0,
      },
    },
  }),
})

export const event = style({
  position: 'relative',
  marginBottom: 110,
  marginLeft: 0,
  ...themeUtils.responsiveStyle({
    lg: {
      marginBottom: 0,
    },
  }),
})

export const eventSimple = style({
  position: 'relative',
  minWidth: 300,
  fontWeight: theme.typography.light,
  fontSize: 18,
  color: theme.color.white,
  lineHeight: 1.555555,
})

export const eventLarge = style({ minWidth: 1000 })

export const bulletLine = style({
  display: 'inline-flex',
  justifyItems: 'center',
  maxWidth: 126,
  alignItems: 'center',
  height: 'auto',
  position: 'relative',
  left: 0,
  transform: `rotate(-90deg)`,
  transformOrigin: '50% 50%',
  bottom: 52,
  ...themeUtils.responsiveStyle({
    lg: {
      transform: `rotate(0deg)`,
      left: -12,
      bottom: 'initial',
    },
  }),
})

export const bulletLineLarger = style({
  marginTop: -10,
  marginRight: 'initial',
  ...themeUtils.responsiveStyle({
    lg: {
      marginTop: 'initial',
      marginRight: -15,
    },
  }),
})

export const section = style({
  display: 'flex',
  flexDirection: 'column-reverse',
  ...themeUtils.responsiveStyle({
    lg: {
      flexDirection: 'row',
    },
  }),
})

export const left = style({
  textAlign: 'center',
  height: 46,
  paddingRight: 0,
  width: 'auto',
  ...themeUtils.responsiveStyle({
    lg: {
      paddingRight: 20,
      paddingTop: 40,
      textAlign: 'right',
      width: 100,
      height: 'auto',
    },
  }),
})

export const right = style({
  position: 'relative',
  display: 'flex',
  flexGrow: 1,
})

export const monthContainer = style({
  display: 'flex',
  justifyContent: 'end',
  flexDirection: 'row',
  ...themeUtils.responsiveStyle({
    lg: {
      flexDirection: 'column',
    },
  }),
})

export const yearContainer = style({
  position: 'relative',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  ...themeUtils.responsiveStyle({
    lg: {
      flexDirection: 'column',
      paddingBottom: 40,
    },
  }),
})

export const eventsContainer = style({
  position: 'relative',
  display: 'flex',
  margin: 0,
  flexDirection: 'row',
  ...themeUtils.responsiveStyle({
    lg: {
      marginTop: 40,
      flexDirection: 'column',
    },
  }),
})

export const leftLabel = style({
  color: theme.color.blue300,
  textTransform: 'capitalize',
})

export const arrowButton = style({
  position: 'absolute',
  width: 40,
  lineHeight: 0,
  height: 40,
  backgroundColor: theme.color.white,
  boxShadow: `0 4px 25px rgba(0, 0, 0, 0.1)`,
  borderRadius: '50%',
  zIndex: 1,
  outline: 0,
  display: 'none',
  ...themeUtils.responsiveStyle({
    lg: {
      display: 'inline-block',
    },
  }),
  ':disabled': {
    cursor: 'default',
    backgroundColor: theme.color.dark200,
  },
})

export const arrowButtonTypes = styleMap({
  prev: {
    bottom: 40,
    left: 0,
    transform: `rotate(0)`,
    ...themeUtils.responsiveStyle({
      lg: {
        top: -20,
        left: 79,
        transform: `rotate(90deg)`,
      },
    }),
  },
  next: {
    bottom: 40,
    right: 0,
    transform: `rotate(-180deg)`,
    ...themeUtils.responsiveStyle({
      lg: {
        bottom: -20,
        left: 79,
        transform: `rotate(-90deg)`,
      },
    }),
  },
})
