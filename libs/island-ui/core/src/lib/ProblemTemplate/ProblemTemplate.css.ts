import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const problemTemplateContainer = recipe({
  base: {
    ...themeUtils.responsiveStyle({
      md: {
        borderWidth: theme.border.width.standard,
        borderRadius: theme.border.radius.xl,
      },
    }),
  },
  variants: {
    red: {
      true: themeUtils.responsiveStyle({
        md: {
          borderColor: theme.color.red200,
        },
      }),
    },
    blue: {
      true: themeUtils.responsiveStyle({
        md: {
          borderColor: theme.color.blue200,
        },
      }),
    },
    yellow: {
      true: themeUtils.responsiveStyle({
        md: {
          borderColor: theme.color.yellow400,
        },
      }),
    },
    noBorder: {
      true: themeUtils.responsiveStyle({
        md: {
          borderWidth: 0,
          borderRadius: 0,
        },
      }),
    },
  },
})

export const problemTemplateImg = style({
  minHeight: '20vh',
  ...themeUtils.responsiveStyle({
    md: {
      maxHeight: '300px',
      minHeight: '250px',
    },
  }),
})
