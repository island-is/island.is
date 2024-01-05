import { theme } from '@island.is/island-ui/theme'
import { globalStyle, style } from '@vanilla-extract/css'

export const wrap = style({
  marginBottom: -theme.spacing[1],
})

export const breadIcon = style({
  position: 'relative',
  display: 'inline-block',
  top: '3px',
})

export const lock = style({
  position: 'absolute',
  margin: 'auto',
  right: 20,
  top: 0,
  bottom: 0,
})

export const btn = style({})

globalStyle(`${btn} > span`, {
  boxShadow: 'none',
})

export const fullWidthSplit = style({
  '@media': {
    [`screen and (min-width: ${theme.breakpoints.lg}px)`]: {
      background:
        'linear-gradient( to right, white 0%, white 45%, #F8F8FA 45%, #F8F8FA 100% );',
    },
    [`screen and (min-width: ${theme.breakpoints.xl}px)`]: {
      background:
        'linear-gradient( to right, white 0%, white 45.5%, #F8F8FA 45%, #F8F8FA 100% );',
    },
    [`screen and (min-width: 2000px)`]: {
      background:
        'linear-gradient( to right, white 0%, white 46%, #F8F8FA 45%, #F8F8FA 100% );',
    },
    [`screen and (min-width: 2600px)`]: {
      background:
        'linear-gradient( to right, white 0%, white 47.5%, #F8F8FA 45%, #F8F8FA 100% );',
    },
  },
})
