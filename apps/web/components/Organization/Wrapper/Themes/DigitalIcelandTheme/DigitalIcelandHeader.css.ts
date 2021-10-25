import { style } from '@vanilla-extract/css'
import { blueberry100, themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  height: 385,
  marginTop: -130,
  paddingTop: 130,
  background: blueberry100,
  backgroundRepeat: 'no-repeat',
  backgroundPositionY: 'bottom',
})

export const imageBg = style({
  background:
    'url(https://images.ctfassets.net/8k0h54kbe6bj/29M6wHAD2ETrhdnzZouJJ9/e6515d58eb120cacb04a98f45f413c98/Myndskr.svg)',
  height: 256,
  backgroundRepeat: 'no-repeat',
  backgroundPositionX: 'center',
  backgroundPositionY: 'bottom',
  backgroundSize: 'auto 240px',
})

export const dotBg = style({
  background:
    'url(https://images.ctfassets.net/8k0h54kbe6bj/7ydJpxnXKz80SBKNRhZR5t/29dce58774585edafaef8986f6a44cd7/Vector__2_.svg)',
  backgroundPositionY: '8px',
})

export const title = style({
  width: 200,
  marginTop: 80,
  marginLeft: 16,
  background:
    'linear-gradient(122.37deg, #0161FD -20.11%, #3F46D2 19.5%, #812EA4 60.71%, #C21578 101.91%, #FD0050 138.36%)',
  backgroundClip: 'text',
  ['-webkit-background-clip' as any]: 'text',
  ['-webkit-text-fill-color' as any]: 'transparent',
})

export const iconCircle = style({
  height: 136,
  width: 136,
  background: '#fff',
  borderRadius: '50%',
  margin: '0 auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  boxShadow: '0px 4px 30px rgba(0, 97, 255, 0.08)',
  ...themeUtils.responsiveStyle({
    xs: {
      marginTop: 16,
    },
    md: {
      marginTop: 104,
      position: 'relative',
    },
  }),
})

export const headerBorder = style({
  ...themeUtils.responsiveStyle({
    md: {
      borderBottom: '4px solid #ffbe43',
    },
  }),
})

export const headerWrapper = style({
  marginTop: -20,
})

export const headerLogo = style({
  width: 70,
  maxHeight: 70,
})
