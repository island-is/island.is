import { style } from '@vanilla-extract/css'
import { themeUtils } from '@island.is/island-ui/theme'

export const headerBg = style({
  ...themeUtils.responsiveStyle({
    xs: {
      background: '#013E85',
      paddingBottom: 50,
    },
    lg: {
      background: `#013E85 url('https://images.ctfassets.net/8k0h54kbe6bj/7MkP1ci92uTwXVOEckAlPS/0e029903d96ebf05cb70a1b65e85d51e/election.png')`,
      backgroundRepeat: 'no-repeat !important',
      backgroundPositionY: '0',
      backgroundPositionX: '100%',
      height: 404,
      paddingBottom: 0,
    },
  }),
})
