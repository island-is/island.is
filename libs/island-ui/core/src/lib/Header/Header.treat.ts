import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'
import { responsiveStyleMap } from '../../utils/responsiveStyleMap'

export const container = responsiveStyleMap({
  height: { xs: 80, md: 112 },
})

export const userNameContainer = style({
  flex: 1,
  minWidth: 0,
})
