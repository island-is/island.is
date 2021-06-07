import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

const BLEED_AMOUNT = 135

export const header = style({
  display: 'inline-block',
  width: '100%',
  height: 800,
  backgroundBlendMode: 'saturation',
  background: `linear-gradient(99.09deg, #003D85 23.68%, #4E8ECC 123.07%),
    linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0, 0, 0, 0) 70%),
    url('https://images.ctfassets.net/8k0h54kbe6bj/47lCoLCMeg5tCuc6HXbKyg/dc0ca3f94f536ad62e40398baa90db04/Group.svg')`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center, center center, 43.5% 100px',
  backgroundSize: '100%, 100%, auto 150%',
})

export const categories = style({
  position: 'relative',
  display: 'inline-block',
  width: '100%',
  // backgroundColor: theme.color.white,
  top: -BLEED_AMOUNT,
  marginBottom: -BLEED_AMOUNT,
})
