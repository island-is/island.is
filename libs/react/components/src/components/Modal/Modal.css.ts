import { theme, themeUtils } from '@island.is/island-ui/theme'
import { style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

export const modal = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing[2],

    zIndex: 100,
    position: 'absolute',

    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: ['85vh', `calc(100dvh - ${theme.spacing[8]}px)`],
    width: '100%',
    maxWidth: 888,

    paddingTop: theme.spacing[3],

    backgroundColor: theme.color.white,
    boxShadow: theme.shadows.strong,

    ...themeUtils.responsiveStyle({
      md: {
        position: 'relative',
        margin: `${theme.spacing['6']}px auto`,

        maxWidth: 'min(calc(100vw - 64px), 888px)',

        paddingTop: theme.spacing[9],
      },
    }),
  },
  variants: {
    noPaddingBottom: {
      false: {
        paddingBottom: theme.spacing[3],
        ...themeUtils.responsiveStyle({
          md: {
            paddingBottom: theme.spacing[6],
          },
        }),
      },
    },
    scrollType: {
      inside: {
        ...themeUtils.responsiveStyle({
          md: {
            maxHeight: [
              `calc(100vh - ${theme.spacing[12]}px)`,
              `calc(100dvh - ${theme.spacing[12]}px)`,
            ],
          },
        }),
      },
      outside: {
        ...themeUtils.responsiveStyle({
          md: {
            maxHeight: 'none',
          },
        }),
      },
    },
  },
})

// This is not a part of the parent for better scroll bar placement.
const sharedPaddingX = style({
  paddingLeft: theme.spacing[3],
  paddingRight: theme.spacing[3],

  ...themeUtils.responsiveStyle({
    md: {
      paddingLeft: theme.spacing[6],
      paddingRight: theme.spacing[6],
    },
  }),
})

export const header = style([
  sharedPaddingX,
  {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    columnGap: theme.spacing[2],
    alignItems: 'start',
  },
])

export const close = style({
  gridColumn: '2',

  ...themeUtils.responsiveStyle({
    md: {
      position: 'absolute',
      top: theme.spacing[4],
      right: theme.spacing[4],
    },
  }),
})

export const content = recipe({
  base: [
    sharedPaddingX,
    {
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',

      overflowX: 'hidden',
      WebkitOverflowScrolling: 'touch',
    },
  ],
  variants: {
    scrollType: {
      inside: {
        overflowX: 'hidden',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      },
      outside: {
        ...themeUtils.responsiveStyle({
          md: {
            overflow: 'initial',
          },
        }),
      },
    },
  },
})
