import { theme } from '@island.is/island-ui/theme'
import { globalStyle, keyframes, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const inputWrapper = style({
  display: 'inline-block',
  position: 'relative',
  width: '100%',

  maxWidth: 500,

  '@media': {
    [`screen and (min-width: 1100px)`]: {
      maxWidth: 'none',
    },
  },
})

export const nationalIdInput = recipe({
  base: [
    inputWrapper,
    {
      minWidth: 190,
    },
  ],
  variants: {
    showRemoveButton: {
      true: {
        '@media': {
          [`screen and (min-width: 1100px)`]: {
            maxWidth: '33%',
          },
        },
      },
      false: {
        '@media': {
          [`screen and (min-width: 1100px)`]: {
            maxWidth: '40%',
          },
        },
      },
    },
  },
})

globalStyle(`${inputWrapper} input`, {
  paddingRight: 0,
})

export const icon = style({
  position: 'absolute',
  lineHeight: 0,
  top: '50%',
  right: 16,
  transform: 'translateY(-50%)',
  marginTop: 11, // offset label
})

export const loadingIcon = style({
  animationName: keyframes({
    from: {
      transform: 'translateY(-50%) rotate(0deg)',
    },
    to: {
      transform: 'translateY(-50%) rotate(360deg)',
    },
  }),
  animationDuration: '1.5s',
  animationIterationCount: 'infinite',
  animationTimingFunction: 'linear',
})

export const nationalIdRow = style({
  display: 'flex',
  flexDirection: 'row',
  columnGap: theme.spacing[2],
  alignItems: 'flex-end',
  width: '100%',

  '@media': {
    [`screen and (min-width: 1100px)`]: {
      display: 'contents',
    },
  },
})

export const container = style({
  display: 'flex',
  flexDirection: 'column',
  rowGap: theme.spacing[2],
  columnGap: theme.spacing[3],
  flexGrow: 1,
  alignItems: 'flex-start',

  '@media': {
    [`screen and (min-width: 1100px)`]: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      maxWidth: 750,
    },
  },
})

export const removeButtonWrapper = style({
  display: 'flex',
  alignItems: 'flex-end',
  flexShrink: 0,
  paddingBottom: 4,

  '@media': {
    [`screen and (min-width: 1100px)`]: {
      order: 1,
    },
  },
})
