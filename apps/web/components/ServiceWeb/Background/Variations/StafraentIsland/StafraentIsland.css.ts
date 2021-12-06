import { themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

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
  opacity: 0.05,
  width: 1300,
  left: '-30%',
  ...themeUtils.responsiveStyle({
    md: {
      left: 'initial',
    },
  }),
})

export const small = style({
  top: 250,
})
