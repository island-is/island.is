import { style, styleMap } from 'treat'
import { themeUtils, theme } from '@island.is/island-ui/theme'

export const container = style({
  position: 'relative',
  display: 'flex',
  background: `linear-gradient(120.27deg, #0161FD -0.52%, #3F46D2 29.07%, #812EA4 59.85%, #C21578 90.63%, #FD0050 117.86%)`,
})

export const innerContainer = style({
  position: 'relative',
  whiteSpace: 'nowrap',
  display: 'flex',
  flexDirection: 'row',
  ...themeUtils.responsiveStyle({
    lg: {
      minWidth: '100%',
      padding: '40px 0',
      flexDirection: 'column',
    },
  }),
})

export const frame = style({
  position: 'relative',
  display: 'flex',
  padding: '0 20px',
  minWidth: '100%',
  overflow: 'scroll',
  ...themeUtils.responsiveStyle({
    lg: {
      padding: '20px 0',
      maxHeight: 1200,
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
      margin: '40px 0',
    },
  }),
})

export const eventWrapper = style({
  position: 'relative',
  display: 'inline-flex',
  width: 'auto',
  minHeight: 600,
  marginRight: 40,
  marginBottom: 0,
  flexDirection: 'column-reverse',
  ':last-child': {
    marginRight: 0,
  },
  ...themeUtils.responsiveStyle({
    lg: {
      flexDirection: 'row',
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
  left: 120,
  minWidth: 300,
  fontWeight: theme.typography.light,
  fontSize: 18,
  color: theme.color.white,
  lineHeight: 1.555555,
})

export const eventLarge = style({ minWidth: 1000 })

export const bulletLine = style({
  zIndex: 1,
  position: 'absolute',
  left: -12,
})

export const bulletLineLarger = style({
  position: 'absolute',
  top: 20,
  left: -12,
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
      textAlign: 'right',
      width: 100,
      height: 'auto',
    },
  }),
})

export const right = style({
  position: 'relative',
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
  ':before': {
    content: '""',
    position: 'absolute',
    opacity: 0.5,
    width: 'auto',
    height: 8,
    left: 0,
    right: 0,
    top: 'initial',
    bottom: 56,
    background: `linear-gradient(-90.09deg, #0161FD 15.89%, #3F46D2 33.21%, #812EA4 51.23%, #C21578 69.24%, #FD0050 85.18%)`,
  },
  ...themeUtils.responsiveStyle({
    lg: {
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

export const eventsContainer = style({
  position: 'relative',
  display: 'flex',
  margin: 0,
  flexDirection: 'row',
  ...themeUtils.responsiveStyle({
    lg: {
      margin: '40px 0',
      flexDirection: 'column',
    },
  }),
})

export const leftLabel = style({
  color: theme.color.blue300,
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
})

export const arrowButtonTypes = styleMap({
  prev: {
    bottom: 40,
    left: 0,
    transform: `rotate(0)`,
    ...themeUtils.responsiveStyle({
      lg: {
        top: -20,
        left: 81,
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
        left: 81,
        transform: `rotate(-90deg)`,
      },
    }),
  },
})
