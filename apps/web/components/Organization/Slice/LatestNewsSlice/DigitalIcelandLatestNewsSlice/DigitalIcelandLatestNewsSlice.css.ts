import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const frontpageSeeMoreLink = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: theme.spacing[1],
  color: theme.color.blue400,
  fontSize: 16,
  lineHeight: 1.25,
  fontWeight: theme.typography.semiBold,
  paddingBottom: 2,
  boxShadow: 'inset 0 -1px 0 0 currentColor',
  ':hover': {
    color: theme.color.blueberry400,
  },
})

export const itemListContainerMobileScroll = style({
  display: 'grid',
  gap: theme.spacing[4],
  ...themeUtils.responsiveStyle({
    xs: {
      gridAutoFlow: 'column',
      gridAutoColumns: 'minmax(260px, 320px)',
      overflowX: 'auto',
      gap: theme.spacing[3],
      scrollbarWidth: 'none',
      selectors: {
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      },
    },
    lg: {
      gridAutoFlow: 'row',
      gridAutoColumns: 'auto',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: theme.spacing[3],
      overflowX: 'visible',
    },
    xl: {
      gridAutoFlow: 'row',
      gridAutoColumns: 'auto',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: theme.spacing[4],
      overflowX: 'visible',
    },
  }),
})
