import { style } from '@vanilla-extract/css'

// Past-appointment card treatment — Figma uses 50%/60% alpha versions of
// dark200/dark100/dark400, which the theme palette has no tokens for.
// The doubled selector out-specifies Box's background/border color classes.
export const pastCard = style({
  selectors: {
    '&&': {
      backgroundColor: 'rgba(242, 242, 245, 0.5)',
      borderColor: 'rgba(204, 204, 216, 0.5)',
    },
  },
})

// Fixed 14px on all breakpoints — no Text variant offers this
// (medium is 14→16px, small is 12→14px across the mobile/desktop breakpoint)
export const cancelInfoText = style({
  selectors: {
    '&&': {
      fontSize: 14,
    },
  },
})

export const pastTitle = style({
  selectors: {
    '&&': {
      color: 'rgba(0, 0, 60, 0.6)',
    },
  },
})
