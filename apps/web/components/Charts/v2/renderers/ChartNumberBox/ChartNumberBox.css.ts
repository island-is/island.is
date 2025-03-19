import { style } from '@vanilla-extract/css'

import { theme, themeUtils } from '@island.is/island-ui/theme'

export const wrapper = style({
  display: 'grid',
  gap: theme.spacing[2],
  gridTemplateColumns: '1fr',
  width: '100%',
  height: '100%',
})

export const wrapperTwoChildren = style({
  gridTemplateColumns: '2fr 1fr',
})

export const wrapperThreeChildren = style({
  ...themeUtils.responsiveStyle({
    xs: {
      gridTemplateColumns: '1fr 1fr',
    },
    xl: {
      gridTemplateColumns: '1fr 1fr 1fr',
    },
  }),
})

export const numberBox = style({
  backgroundColor: theme.color.blue100,
  borderRadius: theme.border.radius.large,
  color: theme.color.blue400,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: theme.spacing[3],
})

export const numberBoxFillWidth = style({
  ...themeUtils.responsiveStyle({
    xs: {
      gridColumn: 'span 2',
    },
    xl: {
      gridColumn: 'unset',
    },
  }),
})

export const titleWrapper = style({
  alignItems: 'flex-start',
  color: theme.color.dark400,
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: theme.spacing[1],
})

export const title = style({
  fontSize: '14px',
  fontWeight: theme.typography.semiBold,
})

export const value = style({
  alignItems: 'center',
  color: theme.color.blue400,
  display: 'flex',
  fontSize: '34px',
  fontWeight: theme.typography.semiBold,
  gap: theme.spacing[1],
  ...themeUtils.responsiveStyle({
    lg: {
      fontSize: '42px',
    },
  }),
})
