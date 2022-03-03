import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const bg = style({
  position: 'absolute',
  display: 'flex',
  flexWrap: 'wrap',
  flexDirection: 'column-reverse',
  alignContent: 'center',
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
})

export const illustration = style({
  position: 'relative',
  opacity: 0.15,
  width: 1344,
  height: 561,
  left: '-30%',
  top: 150,
  ...themeUtils.responsiveStyle({
    md: {
      left: 'initial',
    },
  }),
})

export const small = style({
  top: 400,
})
