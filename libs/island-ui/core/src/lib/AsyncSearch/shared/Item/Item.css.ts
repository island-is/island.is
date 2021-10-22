import { style, styleVariants } from '@vanilla-extract/css'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const colored = style({
  backgroundColor: theme.color.blue100,
})

export const plain = style({
  backgroundColor: theme.color.white,
})

export const selectedColored = style({
  backgroundColor: theme.color.white,
})

export const selected = style({
  backgroundColor: theme.color.blue100,
})

export const item = style({
  position: 'relative',
  fontWeight: theme.typography.light,
  padding: 16,
  outline: 0,
})

export const customItem = style({
  position: 'relative',
})

export const divider = style({
  position: 'absolute',
  backgroundColor: theme.color.blue200,
  bottom: 1,
  left: 16,
  right: 16,
  height: 1,
  pointerEvents: 'none',
  opacity: 0,
  selectors: {
    [`${item}:last-child &, ${customItem}:last-child &`]: {
      opacity: 0,
    },
  },
})

export const dividerVisible = style({
  opacity: 1,
})

export const sizes = styleVariants({
  medium: {
    fontSize: 15,
    lineHeight: 1.466666,
    ...themeUtils.responsiveStyle({
      md: {
        fontSize: 18,
        lineHeight: 1.416666,
      },
    }),
  },
  large: {
    fontSize: 20,
    lineHeight: 1.4,
    ...themeUtils.responsiveStyle({
      md: {
        lineHeight: 1.416666,
        fontSize: 24,
      },
    }),
  },
})
