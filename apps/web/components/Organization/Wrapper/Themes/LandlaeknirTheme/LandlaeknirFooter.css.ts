import { style } from '@vanilla-extract/css'

import { themeUtils } from '@island.is/island-ui/theme'

export const container = style({
  backgroundColor: '#E8EDF8',
})

export const mainColumn = style({
  paddingTop: '30px',
  paddingBottom: '40px',
})

export const borderTop = style({
  borderTop: '1px solid #202C53',
  marginTop: '10px',
  marginBottom: '35px',
})

export const borderBottom = style({
  borderBottom: '1px solid #202C53',
  marginTop: '20px',
  marginBottom: '30px',
})

export const bottomLine = style({
  display: 'none',
  ...themeUtils.responsiveStyle({
    md: {
      display: 'flex',
    },
  }),
})

export const row = style({
  display: 'flex',
  flexFlow: 'row nowrap',
  alignItems: 'center',
})

export const logoRow = style({
  display: 'flex',
  gap: '32px',
  alignItems: 'center',
})

export const noWrap = style({
  whiteSpace: 'nowrap',
})
