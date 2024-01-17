import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  background: `url('https://images.ctfassets.net/8k0h54kbe6bj/26GpjBNZtKP3FVYlnqplLz/cdf4ec749375332fc3ff40fe8894ca9b/Artboard_1_1.svg')`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  height: 385,
  marginTop: -130,
  paddingTop: 130,
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
      marginTop: 32,
    },
    md: {
      marginTop: 104,
      position: 'relative',
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
