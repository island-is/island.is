import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const menuStyle = style({
  position: 'relative',
  zIndex: 20,
})

export const sidebarCardContainer = style({
  display: 'flex',
  flexFlow: 'column nowrap',
  gap: '24px',
})

export const digitalIcelandHeaderTitle = style({
  background:
    'linear-gradient(122.37deg, #0161FD -20.11%, #3F46D2 19.5%, #812EA4 60.71%, #C21578 101.91%, #FD0050 138.36%)',
  backgroundClip: 'text',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ['-webkit-text-fill-color' as any]: 'transparent',
  textShadow: '0px 0px #00000000',
})

export const sakHeaderGridContainer = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: '315px',
      gridTemplateColumns: '52fr 48fr',
    },
  }),
})

export const landlaeknirHeaderGridContainer = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: '315px',
      gridTemplateColumns: '60fr 40fr',
    },
  }),
})

export const shhHeaderGridContainerBase = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: '315px',
      gridTemplateColumns: '65fr 35fr',
    },
  }),
})
export const shhHeaderGridContainerWidth = style([
  shhHeaderGridContainerBase,
  themeUtils.responsiveStyle({
    lg: {
      background:
        "url('https://images.ctfassets.net/8k0h54kbe6bj/1glTNLK2OYnp9XsL4EVuVa/6813e691f7863dda32e4637de5142c71/Mynd_a___banner.svg') bottom right no-repeat",
      backgroundSize: '450px 100%',
    },
  }),
])
export const shhHeaderGridContainerWidthSubpage = shhHeaderGridContainerBase
