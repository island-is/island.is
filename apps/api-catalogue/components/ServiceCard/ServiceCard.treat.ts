import { style } from 'treat'
import { theme } from '@island.is/island-ui/theme'

export const defaultWidth = 400

export const card = style({
  width: 310,
  minHeight: 144,
  marginBottom: 20,
  marginRight: 20,
  fontFamily: theme.typography.fontFamily,
  borderColor: theme.color.blue200,
  borderWidth: 1,
  borderStyle: 'solid',
  ':hover': {
    borderColor: theme.color.blue400,
    textDecoration: 'none',
  },
})

export const name = style({
  fontSize: 18,
  color: theme.color.blue400,
  fontWeight: 600,
})

export const owner = style({
  fontSize: 14,
  color: theme.color.dark400,
  fontWeight: 300,
  paddingTop: 2,
})

export const serviceStatus = style({
  position: 'relative',
  display: 'flex',
  justifyContent: 'flex-end',
  right: -18,
  top: -42,
})

const globalItems = {
  paddingLeft: 32,
  paddingRight: 32,
  paddingTop: 24,
  paddingBottom: 24,
}

export const scrollBoxWrapper = style({
  width: '100%',
  height: '100%',
  overflowY: 'hidden',
  overflowX: 'hidden',
  borderBottomLeftRadius: 7,
})

export const category = style({
  width: '100%',
  display: 'inline-flex',
  background: theme.color.white,
  // paddingLeft: globalItems.paddingLeft - 5,
  // paddingRight: globalItems.paddingRight - 5,
  borderBottomLeftRadius: 7,
  borderBottomRightRadius: 7,
  paddingTop: 5,
  paddingBottom: 2,
  fontWeight: 600,
})

export const categoryItem = style({
  color: theme.color.blue400,
  background: theme.color.blue100,
  borderRadius: 5,
  paddingTop: 6,
  paddingBottom: 6,
  paddingLeft: 8,
  paddingRight: 8,
  fontSize: 12,
  minWidth: 40,
  marginLeft: 4,
  marginRight: 4,
  marginBottom: 3,
  display: 'flex',
  flexShrink: 0,
})

export const cardTexts = style({
  paddingLeft: globalItems.paddingLeft,
  paddingRight: globalItems.paddingRight,
  paddingTop: globalItems.paddingTop,
  paddingBottom: globalItems.paddingBottom,
})
