import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const linkContainer = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  gap: '4px',
  alignSelf: 'flex-start',
  marginLeft: '24px',
  marginTop: '100px',
  whiteSpace: 'nowrap',
})

export const linkContainerMobile = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
  gap: '4px',
  width: 'fit-content',
})

export const fullWidthContainer = style({
  display: 'flex',
  gap: '4px',
  ...themeUtils.responsiveStyle({
    xs: {
      flexFlow: 'column nowrap',
    },
    md: {
      flexFlow: 'row nowrap',
    },
  }),
})
