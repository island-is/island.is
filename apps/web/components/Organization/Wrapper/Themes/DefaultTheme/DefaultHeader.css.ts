import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const gridContainer = style({
  display: 'grid',
  ...themeUtils.responsiveStyle({
    xs: {
      gridTemplateRows: '200px 255px',
    },
    md: {
      gridTemplateRows: '255px',
      gridTemplateColumns: '1fr 1fr',
    },
  }),
})

export const textContainer = style({
  ...themeUtils.responsiveStyle({
    xs: {
      order: 1,
      textAlign: 'center',
      minHeight: '255px',
      paddingTop: '32px',
    },
    md: {
      order: 0,
      textAlign: 'right',
      paddingRight: '32px',
      paddingTop: '32px',
      minHeight: '255px',
    },
  }),
})

export const headerImage = style({
  height: '100%',
  width: '100%',
  objectFit: 'cover',
  ...themeUtils.responsiveStyle({
    xs: {
      order: 0,
    },
    md: {
      order: 1,
    },
  }),
})

export const logoContainer = style({
  width: '136px',
  height: '136px',
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.08)',
  position: 'absolute',
  bottom: '-32px',
  left: '7%',
  display: 'grid',
  placeItems: 'center',
})

export const logo = style({
  width: '70px',
  height: '70px',
})

export const contentContainer = style({
  maxWidth: '1440px',
  width: '100%',
  height: '255px',
  position: 'absolute',
  left: '50%',
  transform: 'translate(-50%, 0)',
  paddingLeft: '48px',
  paddingRight: '48px',
})

export const innerContentContainer = style({
  width: '100%',
  height: '100%',
  margin: '0 auto',
  position: 'relative',
})

export const logoContainerMobile = style({
  width: '136px',
  height: '136px',
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.08)',
  display: 'grid',
  placeItems: 'center',
  margin: '0 auto',
})

// export const headerBg = style({
//   order: 1,
//   '@media': {
//     'screen and (min-width: 1000px)': {
//       order: 0,
//     },
//   },
// })

// export const iconCircle = style({
//   height: 136,
//   width: 136,
//   margin: '0 auto',
//   display: 'flex',
//   justifyContent: 'center',
//   alignItems: 'center',
//   boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.08)',
//   ...themeUtils.responsiveStyle({
//     xs: {
//       marginTop: 12,
//     },
//     md: {
//       marginTop: 84,
//       position: 'relative',
//     },
//   }),
// })

// export const headerWrapper = style({})

// export const headerLogo = style({
//   width: 70,
//   maxHeight: 70,
// })

// export const headerImage = style({
//   objectFit: 'cover',
//   height: '200px',
//   width: '100%',
//   order: 0,
//   '@media': {
//     'screen and (min-width: 1000px)': {
//       order: 1,
//       height: '100%',
//     },
//   },
// })

// export const container = style({
//   display: 'grid',
//   gridTemplateRows: '255px',
// })

// export const gridContainer = style({
//   display: 'grid',
//   gridTemplateColumns: '1fr',
//   gridTemplateRows: '200px 1fr',
//   '@media': {
//     'screen and (min-width: 1000px)': {
//       gridTemplateColumns: '1fr 1fr',
//       gridTemplateRows: '255px',
//     },
//   },
// })
