import { style } from 'treat'
import { theme, themeUtils } from '@island.is/island-ui/theme'

export const card = style({
  display: 'flex',
  height: '100%',
  width: '100%',
  flexDirection: 'column',
  cursor: 'pointer',
  boxSizing: 'border-box',
  minHeight: 146,
  textDecoration: 'none',
  position: 'relative',
  ':hover': {
    borderColor: theme.color.purple400,
    textDecoration: 'none',
  },
})

export const cardContent = style({
  display: 'inline-block',
  position: 'relative',
})

export const cardContentNarrower = style({
  width: '60%',
})

export const image = style({
  minWidth: '100%',
})

export const imageContainer = style({
  position: 'relative',
  width: '40%',
  flexGrow: 1,
})

export const imageContainerStacked = style({
  display: 'flex',
  width: '100%',
  height: 200,
  marginTop: 16,
  justifyContent: 'center',
  flexGrow: 0,
  marginBottom: 16,
})
