import { keyframes, style } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const container = style({
  height: '100%',
  margin: 0,

  ...themeUtils.responsiveStyle({
    xs: {
      margin: theme.spacing[1],
      maxWidth: '430px',
      height: 'initial',
      justifyContent: 'initial',
    },
  }),
})

export const containerInner = style({
  maxWidth: theme.contentWidth.medium,
  margin: '0 auto',
})

export const fadeInKeyFrame = keyframes({
  from: { opacity: 0 },
  to: { opacity: 1 },
})

export const fadeIn = style({
  animationName: fadeInKeyFrame,
  animationDuration: '300ms',
})

const createStandardBorder = () =>
  `${theme.border.width.standard}px ${theme.border.style.solid} ${theme.border.color.standard}`

export const cardContainer = style({
  position: 'relative',
  borderTop: createStandardBorder(),
  ...themeUtils.responsiveStyle({
    xs: {
      border: createStandardBorder(),
      borderRadius: theme.border.radius.large,
    },
  }),
})

export const blueBackground = style({
  backgroundColor: theme.color.blue100,
})

export const yellowBackground = style({
  backgroundColor: theme.color.yellow100,
})

export const purpleBackground = style({
  backgroundColor: theme.color.purple100,
})

export const redBackground = style({
  backgroundColor: theme.color.red100,
})

export const greenBackground = style({
  backgroundColor: theme.color.mint100,
})

const logoSize = 40
const logoOffset = logoSize / 2

export const logo = style({
  position: 'absolute',
  top: `-${logoOffset}px`,
  left: `calc(50% - ${logoOffset}px)`,
  background: theme.color.white,
  width: `${logoSize}px`,
})

export const footer = style({
  paddingBottom: theme.spacing[2],
  paddingRight: theme.spacing[3],
  paddingLeft: theme.spacing[3],
  marginTop: theme.spacing[4],
  ...themeUtils.responsiveStyle({
    xs: {
      paddingRight: 0,
      paddingLeft: 0,
      marginTop: 0,
    },
  }),
})

export const linkSeparator = style({
  width: 1,
  backgroundColor: theme.color.blue200,
})
