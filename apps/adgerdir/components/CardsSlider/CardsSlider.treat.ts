import { style, globalStyle } from 'treat'
import { themeUtils } from '@island.is/island-ui/theme'

export const wrapper = style({})

export const item = style({
  display: 'flex',
  paddingRight: 24,
  flexFlow: 'column',
})

globalStyle(`${wrapper} .alice-carousel__wrapper`, {
  overflow: 'visible',
  ...themeUtils.responsiveStyle({
    md: {},
  }),
})
