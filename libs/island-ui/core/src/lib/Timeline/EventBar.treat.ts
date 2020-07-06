import { style } from 'treat'
import { themeUtils, theme } from '@island.is/island-ui/theme'

export const eventBar = style({
  position: 'relative',
  zIndex: 0,
  height: 64,
  left: 110,
  width: 'auto',
  display: 'inline-flex',
  alignItems: 'center',
  borderRadius: 50,
  backgroundColor: theme.color.purple400,
  cursor: 'pointer',
})

export const eventBarIcon = style({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: 64,
  width: 64,
  borderRadius: 50,
  marginRight: 15,
  backgroundColor: theme.color.white,
})

export const eventBarTitle = style({
  display: 'flex',
  alignItems: 'center',
  height: 64,
  paddingRight: 25,
  borderRadius: 50,
  backgroundColor: theme.color.purple100,
})

export const eventBarStats = style({
  position: 'relative',
  zIndex: -1,
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
  height: 64,
  marginLeft: 15,
  paddingRight: 20,
  borderRadius: 50,
  color: 'white',
})

export const title = style({
  fontWeight: theme.typography.semiBold,
  fontSize: 18,
  lineHeight: 1.555555,
  color: theme.color.purple400,
})

export const valueLabel = style({
  display: 'inline-block',
  fontSize: 14,
  color: theme.color.white,
  fontWeight: theme.typography.semiBold,
  lineHeight: 1.142857,
})

export const valueWrapper = style({
  display: 'inline-block',
  fontSize: 34,
  lineHeight: 1.294117,
  color: theme.color.white,
  marginRight: 10,
})

export const value = style({
  display: 'inline-block',
  color: theme.color.white,
  fontWeight: theme.typography.semiBold,
})

export const maxValue = style({
  display: 'inline-block',
  fontWeight: theme.typography.light,
  color: theme.color.purple300,
})
