import { theme } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'

export const footerWrap = style({
  position: 'relative',
  display: 'flex',
  alignItems: 'flex-end',
  // borderTop: `1px solid ${theme.color.purple100}`,
  marginTop: theme.spacing[2],

  // marginInline: 'calc((100% / 6) * -1)',
  // paddingInline: 'calc((100% / 6))',

  maxWidth: '100vw',
  overflow: 'hidden',
  '@media': {
    // [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {
    //   marginInline: 0,
    //   paddingInline: 0,
    // },
    // [`screen and (max-width: ${theme.breakpoints.md}px)`]: {
    //   marginInline: 'calc((100% / 6) * -1)',
    //   paddingInline: 'calc((100% / 6))',
    // },
    // [`screen and (max-width: ${theme.breakpoints.sm}px)`]: {
    //   marginInline: 'calc((100% / 9) * -1)',
    //   paddingInline: 'calc((100% / 9))',
    // },
    // [`screen and (max-width: ${theme.breakpoints.lg}px)`]: {},
  },
})
