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

export const sakHeaderGridContainerSubpage = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: 'auto',
      gridTemplateColumns: '100fr',
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

export const landlaeknirHeaderGridContainerSubpage = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: 'auto',
      gridTemplateColumns: '100fr',
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

export const shhHeaderGridContainerWidthSubpage = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: 'auto',
      gridTemplateColumns: '100fr',
    },
  }),
})

export const rikissaksoknariHeaderGridContainerBase = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  backgroundBlendMode: 'saturation',
  backgroundRepeat: 'no-repeat',
  background: `
      linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 92.19%),
      linear-gradient(-93.41deg, rgba(0, 72, 153, 0.4) -4.61%, rgba(0, 72, 153, 0.62) 17.93%, rgba(0, 72, 153, 0.82) 47.83%, rgba(0, 72, 153, 0.94) 71.31%, rgba(0, 72, 153, 0.95) 94.11%, #004899 114.58%)
      `,
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: '315px',
      gridTemplateColumns: '65fr 35fr',
    },
  }),
})

export const rikissaksoknariHeaderGridContainerWidth = style([
  rikissaksoknariHeaderGridContainerBase,
  themeUtils.responsiveStyle({
    lg: {
      background: `
    url('https://images.ctfassets.net/8k0h54kbe6bj/3k02pUiq44p3Hn6eLf2VuQ/23bbe8981afa02668ddd522e3dc6988f/rikissaksoknari-mynd_1.png') no-repeat right,
    linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 92.19%),
    linear-gradient(-93.41deg, rgba(0, 72, 153, 0.4) -4.61%, rgba(0, 72, 153, 0.62) 17.93%, rgba(0, 72, 153, 0.82) 47.83%, rgba(0, 72, 153, 0.94) 71.31%, rgba(0, 72, 153, 0.95) 94.11%, #004899 114.58%)
    `,
    },
  }),
])

export const rikissaksoknariHeaderGridContainerSubpage = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  backgroundBlendMode: 'saturation',
  backgroundRepeat: 'no-repeat',
  background: `
      linear-gradient(180deg, #000000 0%, rgba(0, 0, 0, 0) 92.19%),
      linear-gradient(-93.41deg, rgba(0, 72, 153, 0.4) -4.61%, rgba(0, 72, 153, 0.62) 17.93%, rgba(0, 72, 153, 0.82) 47.83%, rgba(0, 72, 153, 0.94) 71.31%, rgba(0, 72, 153, 0.95) 94.11%, #004899 114.58%)
      `,
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: 'auto',
      gridTemplateColumns: '100fr',
    },
  }),
})

export const hsaHeaderGridContainerBase = style({
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

export const hsaHeaderGridContainerWidthSubpage = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: 'auto',
      gridTemplateColumns: '100fr',
    },
  }),
})

export const hsaHeaderGridContainerWidth = style([
  hsaHeaderGridContainerBase,
  themeUtils.responsiveStyle({
    lg: {
      background: `url('https://images.ctfassets.net/8k0h54kbe6bj/uc45ywvPOYsIUEQTNfE6s/72fd0f2229407e18c6e2908fb13f51c3/Header_HSA.png') no-repeat right bottom,linear-gradient(90deg, #CCDFFF 0%, #F6F6F6 84.85%)`,
    },
  }),
])

export const rikislogmadurHeaderGridContainerWidthBase = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  backgroundBlendMode: 'saturation',
  backgroundRepeat: 'no-repeat',
  background:
    'linear-gradient(178.67deg, rgba(0, 61, 133, 0.2) 1.87%, rgba(0, 61, 133, 0.3) 99.6%)',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: '315px',
      gridTemplateColumns: '60fr 40fr',
    },
  }),
})

export const rikislogmadurHeaderGridContainerWidth = style([
  rikislogmadurHeaderGridContainerWidthBase,
  themeUtils.responsiveStyle({
    lg: {
      background: `linear-gradient(178.67deg, rgba(0, 61, 133, 0.2) 1.87%, rgba(0, 61, 133, 0.3) 99.6%),
          url('https://images.ctfassets.net/8k0h54kbe6bj/40IgMzNknBQUINDZZwblR/6c7dfdcf0acb3612f2bf61d912c3dd46/rikislogmadur-header-image.png') no-repeat right`,
    },
  }),
])

export const rikislogmadurHeaderGridContainerWidthSubpage = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  background:
    'linear-gradient(178.67deg, rgba(0, 61, 133, 0.2) 1.87%, rgba(0, 61, 133, 0.3) 99.6%)',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: 'auto',
      gridTemplateColumns: '100fr',
    },
  }),
})

export const hveHeaderGridContainer = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  borderBottom: '8px solid #F01E28',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: '315px',
      gridTemplateColumns: '65fr 35fr',
    },
  }),
})

export const hveHeaderGridContainerSubpage = style({
  display: 'grid',
  maxWidth: '1342px',
  margin: '0 auto',
  borderBottom: '8px solid #F01E28',
  ...themeUtils.responsiveStyle({
    lg: {
      gridTemplateRows: 'auto',
      gridTemplateColumns: '100fr',
    },
  }),
})
