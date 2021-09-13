import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'
import {
  BLEED_AMOUNT,
  DESKTOP_HEADER_HEIGHT,
  MOBILE_HEADER_HEIGHT,
  DESKTOP_HEIGHT,
  MOBILE_HEIGHT,
} from '../../../components/ServiceWeb/constants'

export const searchSection = style({
  position: 'relative',
  display: 'inline-block',
  width: '100%',
  height: MOBILE_HEIGHT - DESKTOP_HEADER_HEIGHT,
  overflow: 'hidden',
  marginTop: DESKTOP_HEADER_HEIGHT,
  paddingBottom: 150,
  top: -DESKTOP_HEADER_HEIGHT,
  ...themeUtils.responsiveStyle({
    lg: {
      height: DESKTOP_HEIGHT - MOBILE_HEADER_HEIGHT,
      marginTop: MOBILE_HEADER_HEIGHT,
      top: -MOBILE_HEADER_HEIGHT,
    },
  }),
})

export const categories = style({
  position: 'relative',
  display: 'inline-block',
  width: '100%',
  top: -BLEED_AMOUNT,
  marginBottom: -BLEED_AMOUNT,
})

export const faqs = style({
  position: 'relative',
  width: '100%',
  borderWidth: 1,
  borderStyle: 'solid',
  borderColor: theme.color.blue200,
  borderRadius: theme.border.radius.large,
})
