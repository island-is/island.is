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

export const bg = style({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  zIndex: -1,
  height: MOBILE_HEIGHT,
  backgroundBlendMode: 'saturation',
  background: `linear-gradient(99.09deg, #003D85 23.68%, #4E8ECC 123.07%),
    linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%),
    url('https://images.ctfassets.net/8k0h54kbe6bj/47lCoLCMeg5tCuc6HXbKyg/dc0ca3f94f536ad62e40398baa90db04/Group.svg')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center, center center, 20% 0',
  backgroundSize: '100%, 100%, 90% 150%',
  ...themeUtils.responsiveStyle({
    lg: {
      height: DESKTOP_HEIGHT,
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
